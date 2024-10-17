const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

//console.log('mongo uri:', uri)

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { title } = req.query;
    //console.log('the title we got from the query:', title)

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const db = client.db('main_db');
      const albumsCollection = db.collection('albums');

      const album = await albumsCollection.findOne({ albumTitle: title });

      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }

      if (album.isPremium) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
          jwt.verify(token, JWT_SECRET);
        } catch (error) {
          if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token', error: 'token_invalid' });
          } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired', error: 'token_expired' });
          } else {
            console.error('Token verification error:', error);
            return res.status(500).json({ message: 'Internal server error', error: 'server_error' });
          }
        }
      }

      const tracklistsCollection = db.collection('tracklists');
      const tracksCollection = db.collection('tracks');
      const albumArtworksCollection = db.collection('album_artworks');
      const downloadablesCollection = db.collection('downloadables');

      let tracklistWithDetails = null;
      try {
        const tracklist = await tracklistsCollection.findOne({ _id: ObjectId.createFromHexString(album.tracklistId) });
        if (!tracklist) {
          throw new Error('Tracklist not found');
        }

        const trackIds = tracklist.tracks.map(track => ObjectId.createFromHexString(track.trackId));
        const tracks = await tracksCollection.find({ _id: { $in: trackIds } }).toArray();

        tracklistWithDetails = {
          ...tracklist,
          tracks: tracklist.tracks.map(track => {
            const fullTrackInfo = tracks.find(t => t._id.toString() === track.trackId);
            return {
              ...track,
              trackTitle: fullTrackInfo.trackTitle,
              trackDuration: fullTrackInfo.trackDuration,
              firebaseURL: fullTrackInfo.firebaseURL
            };
          })
        };
      } catch (error) {
        console.error('Error fetching tracklist:', error);
      }

      let albumArtworkUrl = null;
      try {
        const albumArtwork = await albumArtworksCollection.findOne({ _id: ObjectId.createFromHexString(album.albumArtworkId) });
        if (!albumArtwork) {
          throw new Error('Album artwork not found');
        }
        albumArtworkUrl = albumArtwork.firebaseUrl;
      } catch (error) {
        console.error('Error fetching album artwork:', error);
      }

      let downloadable = null;
      if (album.downloadableId && album.downloadableId !== '') {
        try {
          downloadable = await downloadablesCollection.findOne({ _id: ObjectId.createFromHexString(album.downloadableId) });
        } catch (error) {
          console.error('Error fetching downloadable:', error);
        }
      }

      const result = {
        ...album,
        tracklist: tracklistWithDetails ? tracklistWithDetails.tracks : [],
        albumArtworkUrl,
        downloadable
      };

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching album:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
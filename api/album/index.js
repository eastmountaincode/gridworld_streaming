const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { title } = req.query;

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const db = client.db('main_db');
      
      const albumsCollection = db.collection('albums');
      const tracklistsCollection = db.collection('tracklists');
      const tracksCollection = db.collection('tracks');
      const albumArtworksCollection = db.collection('album_artworks');

      const album = await albumsCollection.findOne({ albumTitle: title });

      if (album) {
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

        const result = {
          ...album,
          tracklist: tracklistWithDetails ? tracklistWithDetails.tracks : [],
          albumArtworkUrl
        };

        res.status(200).json(result);
      } else {
        res.status(404).json({ error: 'Album not found' });
      }
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
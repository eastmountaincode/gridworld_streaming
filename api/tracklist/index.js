const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { id } = req.query;

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const db = client.db('main_db');
      const tracklistsCollection = db.collection('tracklists');
      const tracksCollection = db.collection('tracks');

      const tracklist = await tracklistsCollection.findOne({ _id: ObjectId.createFromHexString(id) });

      if (tracklist) {
        const trackIds = tracklist.tracks.map(track => ObjectId.createFromHexString(track.trackId));
        const tracks = await tracksCollection.find({ _id: { $in: trackIds } }).toArray();

        const tracklistWithDetails = {
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

        res.status(200).json(tracklistWithDetails);
      } else {
        res.status(404).json({ error: 'Tracklist not found' });
      }
    } catch (error) {
      console.error('Error fetching tracklist:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
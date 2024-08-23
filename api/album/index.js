const { MongoClient } = require('mongodb');
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

      const album = await albumsCollection.findOne({ albumTitle: title });

      if (album) {
        res.status(200).json(album);
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

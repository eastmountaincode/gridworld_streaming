const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  const client = new MongoClient(uri);

  if (req.method === 'POST') {
    const { trackTitle, trackDuration, firebaseURL } = req.body;

    try {
      await client.connect();
      const db = client.db('main_db');
      const tracksCollection = db.collection('tracks');

      const result = await tracksCollection.insertOne({
        trackTitle,
        trackDuration: parseInt(trackDuration),
        firebaseURL,
        createdAt: new Date()
      });

      res.status(201).json({ message: 'Track uploaded successfully', trackId: result.insertedId });
    } catch (error) {
      console.error('Error uploading track:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else if (req.method === 'GET') {
    const { id } = req.query;

    try {
      await client.connect();
      const db = client.db('main_db');
      const tracksCollection = db.collection('tracks');

      const track = await tracksCollection.findOne({ _id: new ObjectId(id) });

      if (track) {
        res.status(200).json(track);
      } else {
        res.status(404).json({ error: 'Track not found' });
      }
    } catch (error) {
      console.error('Error fetching track:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
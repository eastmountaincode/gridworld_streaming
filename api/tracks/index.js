const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const uri = process.env.MONGODB_URI;
//console.log("MongoDB URI:", uri);

module.exports = async (req, res) => {
    if (req.method === 'POST') {
      const { trackTitle, trackDuration, firebaseURL } = req.body;
  
      const client = new MongoClient(uri);
  
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
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };
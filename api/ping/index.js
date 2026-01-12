const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('main_db');

    // Simple ping command to keep the connection alive
    await db.command({ ping: 1 });

    res.status(200).json({
      status: 'ok',
      message: 'Database connection alive',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ping error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed'
    });
  } finally {
    await client.close();
  }
};

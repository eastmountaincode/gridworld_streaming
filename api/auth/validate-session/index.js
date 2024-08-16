const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Fetch updated user data from MongoDB
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      const db = client.db('main_db');
      const usersCollection = db.collection('users');
      
      const user = await usersCollection.findOne({ _id: ObjectId.createFromHexString(decoded.userId) });
      await client.close();

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Remove sensitive information
      delete user.password;

      return res.status(200).json({ message: 'Token is valid', userData: user });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

module.exports = handler;


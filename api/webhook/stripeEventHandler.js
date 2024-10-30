const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('stripeEventHandler.js loaded');

const parseEvent = (req) => {
  if (req.body instanceof Buffer) {
    return JSON.parse(req.body.toString('utf8'));
  }
  return req.body;
};

const updateUserAccessToken = async (userId) => {
  console.log('Updating user access token for userId:', userId);
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('main_db');
    const usersCollection = db.collection('users');

    const result = await usersCollection.updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      { $set: { has_access_token: true } }
    );

    return result.modifiedCount === 1;
  } finally {
    await client.close();
  }
};

module.exports = async (req, res) => {
  try {
    const event = parseEvent(req);
    console.log('Event received:', event.type);

    if (event.type === 'checkout.session.completed') {
      const userId = event.data.object.metadata.userId;
      console.log('Processing checkout for userId:', userId);

      const updated = await updateUserAccessToken(userId);

      if (updated) {
        console.log(`Updated user ${userId} with access token`);
        res.json({ received: true, updated: true });
      } else {
        console.log(`Failed to update user ${userId}`);
        res.status(404).json({ error: 'User not found or not updated' });
      }
    } else {
      res.json({ received: true, unhandled: true });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

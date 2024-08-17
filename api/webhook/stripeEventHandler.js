const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;

    console.log('in stripeEventHandler.js. before mongo access. userId:', userId);

    const client = new MongoClient(MONGODB_URI);
    try {
      await client.connect();
      const db = client.db('main_db');
      const usersCollection = db.collection('users');

      const result = await usersCollection.updateOne(
        { _id: ObjectId.createFromHexString(userId) },
        { $set: { has_access_token: true } }
      );

      if (result.modifiedCount === 1) {
        console.log(`Updated user ${userId} with access token`);
        res.json({ received: true });
      } else {
        console.log(`Failed to update user ${userId}`);
        res.status(404).json({ error: 'User not found or not updated' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.json({ received: true });
  }
};

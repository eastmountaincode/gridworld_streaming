const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.userId;
      console.log('in stripeEventHandler.js. before mongo access. userId:', userId);

      const client = new MongoClient(uri);
      try {
        await client.connect();
        const database = client.db("main_db");
        const users = database.collection("users");

        await users.updateOne(
          { _id: ObjectId.createFromHexString(userId) },
          { $set: { has_access_token: true } }
        );

        console.log(`Updated user ${userId} with access token`);
      } catch (error) {
        console.error('Error updating user:', error);
      } finally {
        await client.close();
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

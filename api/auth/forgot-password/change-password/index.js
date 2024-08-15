const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const uri = process.env.MONGODB_URI;

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, newPassword } = req.body;

    const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db("main_db");
      const users = database.collection("users");

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await users.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Password updated successfully' });
      } else {
        res.status(400).json({ message: 'Failed to update password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

module.exports = handler;

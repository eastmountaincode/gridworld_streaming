const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const uri = process.env.MONGODB_URI;

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, answer } = req.body;

    const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db("main_db");
      const users = database.collection("users");

      const user = await users.findOne({ email });
      if (user && user.security_question_answer === answer) {
        res.status(200).json({ message: 'Security answer correct' });
      } else {
        res.status(400).json({ message: 'Incorrect security answer' });
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

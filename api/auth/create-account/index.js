const { MongoClient } = require('mongodb');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
//console.log('MongoDB URI:', process.env.MONGODB_URI);
const uri = process.env.MONGODB_URI;

const bcrypt = require('bcrypt');


const handler = async (req, res) => {
  if (req.method === 'POST') {
    // Parse input
    const { email, password, security_question, security_question_answer } = req.body;

    // Check if any field is empty
    if (!email || !password || !security_question || !security_question_answer) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db("main_db");
      const users = database.collection("users");

      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user document
      const newUser = {
        email,
        password: hashedPassword,
        security_question,
        security_question_answer,
        date_created: new Date(),
        has_access_token: false
      };

      // Insert the new user into the database
      const result = await users.insertOne(newUser);


      console.log('User created:', result.insertedId);
      return res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }

  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

module.exports = handler
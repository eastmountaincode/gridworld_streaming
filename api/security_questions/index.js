const { MongoClient } = require('mongodb');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

console.log('MongoDB URI:', process.env.MONGODB_URI);

const uri = process.env.MONGODB_URI;

module.exports = async function handler(req, res) {
  const { method } = req;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("main_db");
    const collection = database.collection("security_questions");

    switch (method) {
      case 'GET':
        // Input: None required
        // Output: JSON object with count of security questions
        const count = await collection.countDocuments();
        res.status(200).json({ count });
        break;
      case 'POST':
        // Input: Array of security question objects in request body
        // Output: JSON object with message indicating number of questions inserted
        const result = await collection.insertMany(req.body);
        res.status(200).json({ message: `${result.insertedCount} security questions inserted` });
        break;
      case 'DELETE':
        // Input: None required
        // Output: JSON object with message indicating number of questions deleted
        const deleteResult = await collection.deleteMany({});
        res.status(200).json({ message: `${deleteResult.deletedCount} security questions deleted` });
        break;
      default:
        // Handle unsupported HTTP methods
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    // Error handling: returns a JSON object with an error message
    res.status(500).json({ message: `Error: ${error.message}` });
  } finally {
    await client.close();
  }
};

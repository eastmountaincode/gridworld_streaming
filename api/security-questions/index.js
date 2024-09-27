const { MongoClient } = require('mongodb');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
console.log('MongoDB URI:', process.env.MONGODB_URI);
const uri = process.env.MONGODB_URI;

module.exports = async function handler(req, res) {
  const { method } = req;
  console.log('Received request:', req.method, req.url);
  console.log('before new MongoClient');
  const client = new MongoClient(uri);
  console.log('Connected to MongoDB');

  try {
    await client.connect();
    const database = client.db("main_db");
    const collection = database.collection("security_questions");

    switch (method) {
      case 'GET':
        // Input: None required
        // Output: JSON object with count of security_questions and array of security_question objects
        const records = await collection.find({}).toArray();
        const count = records.length;
        res.status(200).json({ count, records });
        break;
      case 'POST':
        // Input: Array of security question objects in request body
        // Output: JSON object with message indicating number of questions inserted
        const result = await collection.insertMany(req.body);
        res.status(200).json({ message: `${result.insertedCount} security questions inserted` });
        break;
      case 'DELETE':
        if (req.query.all === 'true') {
          // Delete all security questions
          const deleteAllResult = await collection.deleteMany({});
          res.status(200).json({ message: `All ${deleteAllResult.deletedCount} security questions deleted` });
        } else if (req.query.id) {
          // Delete a specific security question by ID
          const deleteOneResult = await collection.deleteOne({ _id: new ObjectId(req.query.id) });
          if (deleteOneResult.deletedCount === 1) {
            res.status(200).json({ message: `Security question with ID ${req.query.id} deleted` });
          } else {
            res.status(404).json({ message: `Security question with ID ${req.query.id} not found` });
          }
        } else {
          res.status(400).json({ message: 'Specify ?all=true to delete all security questions or provide an id to delete a specific question' });
        }
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
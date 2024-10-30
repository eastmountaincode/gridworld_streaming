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
        const records = await collection.find({}).toArray();
        const count = records.length;
        res.status(200).json({ count, records });
        break;

      case 'POST':
        const result = await collection.insertMany(req.body);
        res.status(200).json({ message: `${result.insertedCount} security questions inserted` });
        break;

      case 'DELETE':
        if (req.query.all === 'true') {
          console.log('Deleting all security questions');
          const deleteAllResult = await collection.deleteMany({});
          console.log('All security questions deleted');
          res.status(200).json({ message: `All ${deleteAllResult.deletedCount} security questions deleted` });
        } else if (req.query.id) {
          console.log(`Deleting security question with ID: ${req.query.id}`);
          const deleteOneResult = await collection.deleteOne({ _id: new ObjectId(req.query.id) });
          if (deleteOneResult.deletedCount === 1) {
            console.log(`Security question with ID ${req.query.id} deleted`);
            res.status(200).json({ message: `Security question with ID ${req.query.id} deleted` });
          } else {
            console.log(`Security question with ID ${req.query.id} not found`);
            res.status(404).json({ message: `Security question with ID ${req.query.id} not found` });
          }
        } else {
          console.log('Invalid DELETE request');
          res.status(400).json({ message: 'Specify ?all=true to delete all security questions or provide an id to delete a specific question' });
        }
        break;

      default:
        console.log('Method not allowed');
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.log('Error occurred:', error.message);
    res.status(500).json({ message: `Error: ${error.message}` });
  } finally {
    console.log('Closing MongoDB connection');
    await client.close();
    console.log('MongoDB connection closed');
  }
};
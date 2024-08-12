import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  const { method, query: { table } } = req;

  switch (method) {
    case 'GET':
      return handleFetch(req, res, table);
    case 'POST':
      return handleSeed(req, res, table);
    case 'DELETE':
      return handleClear(req, res, table);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleFetch(req, res, table) {
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB database
    await client.connect();
    const database = client.db("main_db");
    const collection = database.collection(table);

    // Count the number of documents in the collection
    const count = await collection.countDocuments();

    // Send the count as a response
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: `Error fetching data: ${error.message}` });
  } finally {
    // Always close the database connection
    await client.close();
  }
}

async function handleSeed(req, res, table) {
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB database
    await client.connect();
    const database = client.db("main_db");
    const collection = database.collection(table);

    // Load seed data from a JSON file
    const seedData = require(`../../seed_data/${table}_seed.json`)[table];
    if (!seedData) {
      return res.status(404).json({ message: `No seed data available for ${table}` });
    }

    // Insert the seed data into the collection
    const result = await collection.insertMany(seedData);

    // Send a success message with the number of inserted documents
    res.status(200).json({ message: `${result.insertedCount} documents inserted into ${table}` });
  } catch (error) {
    res.status(500).json({ message: `Error seeding data: ${error.message}` });
  } finally {
    // Always close the database connection
    await client.close();
  }
}

async function handleClear(req, res, table) {
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB database
    await client.connect();
    const database = client.db("main_db");
    const collection = database.collection(table);

    // Delete all documents from the collection
    const result = await collection.deleteMany({});

    // Send a success message with the number of deleted documents
    res.status(200).json({ message: `${result.deletedCount} documents deleted from ${table}` });
  } catch (error) {
    res.status(500).json({ message: `Error clearing data: ${error.message}` });
  } finally {
    // Always close the database connection
    await client.close();
  }
}

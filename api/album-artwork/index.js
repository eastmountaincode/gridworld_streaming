const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        const { id } = req.query;

        const client = new MongoClient(uri);

        try {
            await client.connect();
            const db = client.db('main_db');
            const albumArtworksCollection = db.collection('album_artworks');

            const albumArtwork = await albumArtworksCollection.findOne({ _id: ObjectId.createFromHexString(id) });

            if (albumArtwork) {
                res.status(200).json(albumArtwork);
            } else {
                res.status(404).json({ error: 'Album artwork not found' });
            }
        } catch (error) {
            console.error('Error fetching album artwork:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const client = new MongoClient(uri);
        try {
            await client.connect();
            const database = client.db("main_db");
            const users = database.collection("users");

            const user = await users.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                JWT_SECRET,
                { expiresIn: '3h' }
            );

            return res.status(200).json({
                message: 'Login successful',
                token,
                userData: {
                    userId: user._id,
                    email: user.email,
                    hasAccessToken: user.has_access_token,
                    dateCreated: user.date_created
                }
            });
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

module.exports = handler;

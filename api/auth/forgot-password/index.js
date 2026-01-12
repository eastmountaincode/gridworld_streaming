const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { action } = req.body;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('main_db');
    const users = database.collection('users');

    if (action === 'check-email') {
      const { email } = req.body;
      const user = await users.findOne({ email });
      if (user) {
        return res.status(200).json({ securityQuestion: user.security_question });
      } else {
        return res.status(404).json({ message: 'Email not found.' });
      }
    }

    if (action === 'answer-security-question') {
      const { email, answer } = req.body;
      const user = await users.findOne({ email });
      if (user && user.security_question_answer === answer) {
        return res.status(200).json({ message: 'Security answer correct' });
      } else {
        return res.status(400).json({ message: 'Incorrect security answer' });
      }
    }

    if (action === 'change-password') {
      const { email, newPassword } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await users.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );
      if (result.modifiedCount === 1) {
        return res.status(200).json({ message: 'Password updated successfully' });
      } else {
        return res.status(400).json({ message: 'Failed to update password' });
      }
    }

    return res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error' });
  } finally {
    await client.close();
  }
};

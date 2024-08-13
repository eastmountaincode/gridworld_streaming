const cors = require('cors');
require('dotenv').config();
const express = require('express');

const usersHandler = require('../api/users');
const securityQuestionsHandler = require('../api/security_questions');
const createAccountHandler = require('../api/auth/create_account');

const app = express();
const port = 3001; // Use a different port than your React app

app.use(cors());
app.use(express.json());

app.all('/api/users', async (req, res) => {
  await usersHandler(req, res);
});

app.all('/api/security_questions', async (req, res) => {
  await securityQuestionsHandler(req, res);
});

app.all('/api/auth/create_account', async (req, res) => {
  console.log('Received data:', req.body);
  await createAccountHandler(req, res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

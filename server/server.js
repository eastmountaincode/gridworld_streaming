const cors = require('cors');
require('dotenv').config();
const express = require('express');

const usersHandler = require('../api/users');
const securityQuestionsHandler = require('../api/security_questions');
const createAccountHandler = require('../api/auth/create_account');
const loginHandler = require('../api/auth/login');
const validateTokenHandler = require('../api/auth/validate_token')

const app = express();
const port = 3001; 

app.use(cors());
app.use(express.json());

app.all('/api/users', async (req, res) => {
  await usersHandler(req, res);
});

app.all('/api/security_questions', async (req, res) => {
  await securityQuestionsHandler(req, res);
});

app.all('/api/auth/create_account', async (req, res) => {
  await createAccountHandler(req, res);
});

app.all('/api/auth/login', async (req, res) => {
  await loginHandler(req, res);
});

app.all('/api/auth/validate_token', async (req, res) => {
  await validateTokenHandler(req, res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

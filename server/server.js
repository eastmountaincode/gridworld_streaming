const cors = require('cors');
require('dotenv').config();
const express = require('express');

const usersHandler = require('../api/users');
const securityQuestionsHandler = require('../api/security-questions');
const createAccountHandler = require('../api/auth/create-account');
const loginHandler = require('../api/auth/login');
const validateTokenHandler = require('../api/auth/validate-token')
const checkEmailHandler = require('../api/auth/forgot-password/check-email');
const answerSecurityQuestionHandler = require('../api/auth/forgot-password/answer-security-question');
const changePasswordHandler = require('../api/auth/forgot-password/change-password');

const app = express();
const port = 3001; 

app.use(cors());
app.use(express.json());

app.all('/api/users', async (req, res) => {
  await usersHandler(req, res);
});

app.all('/api/security-questions', async (req, res) => {
  await securityQuestionsHandler(req, res);
});

app.all('/api/auth/create-account', async (req, res) => {
  await createAccountHandler(req, res);
});

app.all('/api/auth/login', async (req, res) => {
  await loginHandler(req, res);
});

app.all('/api/auth/validate-token', async (req, res) => {
  await validateTokenHandler(req, res);
});

app.all('/api/auth/forgot-password/check-email', async (req, res) => {
  await checkEmailHandler(req, res);
});

app.all('/api/auth/forgot-password/answer-security-question', async (req, res) => {
  await answerSecurityQuestionHandler(req, res);
});

app.all('/api/auth/forgot-password/change-password', async (req, res) => {
  await changePasswordHandler(req, res);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

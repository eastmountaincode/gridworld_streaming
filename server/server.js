const cors = require('cors');
require('dotenv').config();
const express = require('express');

const usersHandler = require('../api/users');
const createAccountHandler = require('../api/auth/create-account');
const loginHandler = require('../api/auth/login');
const validateSessionHandler = require('../api/auth/validate-session')
const checkEmailHandler = require('../api/auth/forgot-password/check-email');
const answerSecurityQuestionHandler = require('../api/auth/forgot-password/answer-security-question');
const changePasswordHandler = require('../api/auth/forgot-password/change-password');
const createCheckoutSessionHandler = require('../api/checkout/create-checkout-session');
const createRefreshUserDataHandler = require('../api/auth/refresh-user-data');
const getAlbumHandler = require('../api/album');
const getTracksHandler = require('../api/tracks');


const app = express();
const port = 3001; 

app.use(cors());

// this needs to go before express.json() apparently
app.post('/api/webhook/stripeEventHandler', express.raw({type: 'application/json'}), async (req, res) => {
  await require('../api/webhook/stripeEventHandler')(req, res);
});

app.use(express.json());

app.all('/api/users', async (req, res) => {
  await usersHandler(req, res);
});

app.all('/api/auth/create-account', async (req, res) => {
  await createAccountHandler(req, res);
});

app.all('/api/auth/login', async (req, res) => {
  await loginHandler(req, res);
});

app.all('/api/auth/validate-session', async (req, res) => {
  await validateSessionHandler(req, res);
});

app.all('/api/auth/refresh-user-data', async (req, res) => {
  await createRefreshUserDataHandler(req, res);
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

app.all('/api/checkout/create-checkout-session', async (req, res) => {
  await createCheckoutSessionHandler(req, res);
});

app.all('/api/album', async (req, res) => {
  await getAlbumHandler(req, res);
});

app.all('/api/tracks', async (req, res) => {
  await getTracksHandler(req, res);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

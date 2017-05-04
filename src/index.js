const express = require('express');
const app = express();
const cors = require('cors');
const json = require('body-parser').json;
const Pool = require('pg').Pool;
const path = require('path');

const pool = new Pool({
  user: 'owner',
  password: 'Atarax1a309',
  database: 'REDit',
  port: '5432',
  host: 'localhost'
});

module.exports = pool;

const apiRouter = new express.Router();
const authRouter = new express.Router();

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(json());

app.use('/api', apiRoutes(apiRouter));
app.use('/auth', authRoutes(authRouter));

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
});

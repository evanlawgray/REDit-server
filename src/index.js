const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const json = require('body-parser').json;
const Pool = require('pg').Pool;
const path = require('path');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

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

// app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', apiRoutes(apiRouter));
app.use('/auth', authRoutes(authRouter));

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
});

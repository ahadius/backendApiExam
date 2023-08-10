const express = require('express');
const app = express();
const connecttomongo = require('./db');
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()
const errorMiddleware = require('./middlewares/error.js')
app.use(cors())
connecttomongo();
          
app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.json({ limit: '50mb' }));

app.use('/api/admin', require('./routes/admin.js'));
app.use('/api/user', require('./routes/user.js'));

app.use(errorMiddleware);

module.exports = app;
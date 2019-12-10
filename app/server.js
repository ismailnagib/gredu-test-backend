/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const enrouten = require('express-enrouten');

const app = express();
const port = process.env.PORT || 3000;
const mongodb = require('./db/datasource/mongodb')({ url: process.env.MONGO_DB });

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routing
app.use('/', enrouten({ directory: 'routes' }));

// Not Found handler
app.use('*', (req, res) => res.status(404).json({ message: 'Resource not found.' }));

app.listen(port, () => console.log(`App listening on port ${port}`));

mongodb.connection.on('connected', () => console.log('Connected to MongoDB'));

module.exports = app;

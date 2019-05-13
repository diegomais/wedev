// Import Express module: web application framework.
const express = require('express');

// Import dotenv module: load environment variables from '.env'.
const dotenv = require('dotenv').config();

// Import database configurations
const connectDB = require('./config/db');

// Create app object by calling the top-level express() function exported by Express module.
const app = express();

// Connect Database
connectDB();

/** Respond with 'Hello WeDev' when a GET request is made to the root URL (/) or route.
 * The req (request) and res (response) are the exact same objects that Node provides, so we can
 * invoke req.pipe(), req.on('data', callback), and anything else we would do without Express
 * involved. */
app.get('/', (req, res) => res.send('Hello WeDev!'));

/** Create a constant reference to port declared on environment variables
 * or set the port of remote server to 3001.  */
const PORT = process.env.PORT || 3001;

// Bind and listen for connections on the specified port.
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));

// Import Express module: web application framework.
const express = require('express');

// Import dotenv module: load environment variables from '.env'.
const dotenv = require('dotenv').config();

// Import database configurations
const connectDB = require('./config/db');

// Import NodeJS 'path' module.
const path = require('path');

// Create app object by calling the top-level express() function exported by Express module.
const app = express();

/** Mount middleware that parses incoming requests with JSON payloads.
 * extended: false is a configuration option that tells the parser to use the classic encoding.
 * When using it, values can be only strings or arrays. */
app.use(express.json({ extended: false }));

// Connect Database
connectDB();

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  // Serve React app from Node server
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

/** Create a constant reference to port declared on environment variables
 * or set the port of remote server to 3001.  */
const PORT = process.env.PORT || 3001;

// Bind and listen for connections on the specified port.
app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));

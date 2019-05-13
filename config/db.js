// Import mongoose module: mongodb object modeling for node.js.
const mongoose = require('mongoose');

/** connectDB async function
 * Open connection to database declared on environment variable DB_URI.
 * 'useNewUrlParser':  false by default. Set to true, make all connections set the useNewUrlParser
 *                     option by default.
 * 'useFindAndModify': true by default. Set to false, make findOneAndUpdate() and findOneAndRemove()
 *                     use native findOneAndUpdate() rather than findAndModify().
 * 'useCreateIndex':   false by default. Set to true, make Mongoose's default index build use
 *                     createIndex() instead of ensureIndex() to avoid deprecation warnings from the
 *                     MongoDB driver.
 * */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    console.log('MongoDB connected.');
  } catch (error) {
    console.error(error.message);
    /** Exit process with Uncaught Fatal Exception: There was an uncaught exception,
     * and it was not handled by a domain or an uncaughtException event handler. */
    process.exit(1);
  }
};

module.exports = connectDB;

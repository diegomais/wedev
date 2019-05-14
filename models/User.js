// Import mongoose module: mongodb object modeling for node.js.
const mongoose = require('mongoose');

/** Define user schema that defines the shape of the documents within users collection.
 * Add the index: true options to name and email to optimize queries that use these fields.
 * Add the unique: true option to email field to define a unique index on this property.
 * Add match: RegExp option, to check if the value matches a email address regular expression. */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "can't be blank."],
    index: true
  },
  email: {
    type: String,
    required: [true, "can't be blank."],
    unique: true,
    lowercase: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'is invalid'
    ],
    index: true
  },
  password: {
    type: String,
    required: [true, "can't be blank."],
    select: false
  },
  avatar: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);

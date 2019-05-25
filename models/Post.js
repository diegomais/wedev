// Import mongoose package: mongodb object modeling for node.js.
const mongoose = require('mongoose');

// Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection
// and defines the shape of the documents within that collection.
const Schema = mongoose.Schema;

/** Define post schema that defines the shape of the documents within posts collection.
 * user: A DBRef (database reference) is an ObjectID referencing an object in users collection.
 * name and avatar: Provide display name and avatar of publisher in case of user accout removed.
 * likes: Array of DBRef (database reference) referencing an object in users collection.
 * comments: Array of nested documents. */
const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  name: { type: String },
  avatar: { type: String },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: [{ user: { type: Schema.Types.ObjectId, ref: 'users' } }],
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'users' },
      name: { type: String },
      avatar: { type: String },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = Post = mongoose.model('post', PostSchema);

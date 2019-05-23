// Import mongoose module: mongodb object modeling for node.js.
const mongoose = require('mongoose');

/** Define user schema that defines the shape of the documents within users collection.
 * user: A DBRef (database reference) is an ObjectID referencing an object in users collection.
 * skills: Array of strings.
 * experience: Array of documents.
 * education: Array of documents.
 * socialMediaHandles: Nested documents. */
const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  company: { type: String },
  website: { type: String },
  location: { type: String },
  status: { type: String, required: true },
  skills: { type: [String], required: true },
  bio: { type: String },
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String },
      description: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { Boolean, default: false }
    }
  ],
  education: [
    {
      school: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String, required: true },
      description: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false }
    }
  ],
  socialMediaHandles: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    youtube: { type: String }
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);

// Import Express package: web application framework.
const express = require('express');

// Create a new router object.
const router = express.Router();

// Load authentication middleware.
const auth = require('../../middleware/auth');

// Import express-validator module: middlewares that wraps validator.js functions.
const { check, validationResult } = require('express-validator/check');

// Load User model.
const User = require('../../models/User');

// Load Post model.
const Post = require('../../models/Post');

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      // Validate if text exists in request.
      check('text', 'Text is required.')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // Find the validation errors in this request and wraps them in an object with handy functions.
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array()
      });

    try {
      // Find user document by id from header.
      const user = await User.findById(req.user.id);

      // Build newPost object.
      const newPost = new Post({
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
        text: req.body.text
      });

      // Save the changes on database.
      const post = await newPost.save();

      // Return post saved on database.
      return res.json(post);
    } catch (error) {
      // Outputs the error message to the Web Console.
      console.error(error.message);
      // Return 500 Internal Server Error response code: Indicates that the server encountered an
      // unexpected condition that prevented it from fulfilling the request. */
      return res.status(500).send('Internal Server Error.');
    }
  }
);

module.exports = router;

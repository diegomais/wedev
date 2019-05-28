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

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    // Find all posts and sets the sort order by descending date.
    const posts = await Post.find().sort({ date: -1 });
    // Return all posts found.
    return res.json(posts);
  } catch (error) {
    // Outputs the error message to the Web Console.
    console.error(error.message);
    // Return 500 Internal Server Error response code: Indicates that the server encountered an
    // unexpected condition that prevented it from fulfilling the request. */
    return res.status(500).send('Internal Server Error.');
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Find post document by ID.
    const post = await Post.findById(req.params.id);

    // Return a message if post doesn't exist.
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Return post found.
    return res.json(post);
  } catch (error) {
    // Outputs the error message to the Web Console.
    console.error(error.message);
    // Handle cast error on find when objectId is invalid.
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found.' });
    }
    // Return 500 Internal Server Error response code: Indicates that the server encountered an
    // unexpected condition that prevented it from fulfilling the request. */
    return res.status(500).send('Internal Server Error.');
  }
});

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

// @route    DELETE api/posts/:id
// @desc     Delete a post by ID
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find post document by ID.
    const post = await Post.findById(req.params.id);

    // Return a message if post doesn't exist.
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check if authenticated user is the writer of post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized.' });
    }

    // Remove post on database.
    await post.remove();

    // Return a successful message.
    return res.json({ message: 'Post removed.' });
  } catch (error) {
    // Outputs the error message to the Web Console.
    console.error(error.message);
    // Handle cast error on find when objectId is invalid.
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found.' });
    }
    // Return 500 Internal Server Error response code: Indicates that the server encountered an
    // unexpected condition that prevented it from fulfilling the request. */
    return res.status(500).send('Internal Server Error.');
  }
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    // Find post by ID.
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked by the authenticated user.
    if (post.likes.some(like => like.user.toString() === req.user.id))
      return res.status(400).json({ message: 'Post already liked.' });

    // Adds authenticated user to the beginning of likes array in post document.
    post.likes.unshift({ user: req.user.id });

    // Save the changes on post document on database.
    await post.save();

    // Return likes array.
    return res.json(post.likes);
  } catch (error) {
    // Outputs the error message to the Web Console.
    console.error(error.message);
    // Return 500 Internal Server Error response code: Indicates that the server encountered an
    // unexpected condition that prevented it from fulfilling the request. */
    return res.status(500).send('Internal Server Error.');
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    // Find post by ID.
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked by the authenticated user.
    if (!post.likes.some(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Post has not yet been liked.' });
    }

    // Get index of the authenticated user to remove.
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    // Remove the index that contains the authenticated user.
    post.likes.splice(removeIndex, 1);

    // Save the changes on post document on database.
    await post.save();

    // Return likes array.
    return res.json(post.likes);
  } catch (error) {
    // Outputs the error message to the Web Console.
    console.error(error.message);
    // Return 500 Internal Server Error response code: Indicates that the server encountered an
    // unexpected condition that prevented it from fulfilling the request. */
    return res.status(500).send('Internal Server Error.');
  }
});

module.exports = router;

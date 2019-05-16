// Import Express module: web application framework.
const express = require('express');

// Creates a new router object.
const router = express.Router();

// Mount authentication middleware.
const auth = require('../../middleware/auth');

// Load User model.
const User = require('../../models/User');

// @route    GET api/auth
// @desc     Authentication route
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    // Asynchronously finds user in database and return it.
    const user = await User.findById(req.user.id);
    return res.json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;

// Import Express module: web application framework.
const express = require('express');

// Creates a new router object.
const router = express.Router();

// Mount authentication middleware.
const auth = require('../../middleware/auth');

// Import express-validator module: middlewares that wraps validator.js functions.
const { check, validationResult } = require('express-validator/check');

// Load User model.
const User = require('../../models/User');

// Import bcrypt module: library to hash passwords.
const bcrypt = require('bcryptjs');

// Import jsonwebtoken module: implementation of JSON Web Tokens.
const jwt = require('jsonwebtoken');

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

// @route    POST api/auth
// @desc     Authentication user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid e-mail.').isEmail(),
    check('password', 'Password is required.').exists()
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Destructuring assignment from request.
    const { email, password } = req.body;

    try {
      // Asynchronously finds user and check if they exists.
      let user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res
          .status(401)
          .json({ errors: [{ msg: 'Invalid credentials.' }] });
      }

      // Asynchronously tests password against hash password.
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: 'Invalid credentials.' }] });
      }

      // Create payload to token with user id.
      const payload = { user: { id: user.id } };

      // Asynchronously token signing and return token.
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (error, token) => {
          if (error) throw error;
          return res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;

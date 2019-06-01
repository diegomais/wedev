// Import Express module: web application framework.
const express = require('express');

// Creates a new router object.
const router = express.Router();

// Import express-validator module: middlewares that wraps validator.js functions.
const { check, validationResult } = require('express-validator/check');

// Import Gravatar module: library to generate Gravatar URLs in Node.js Based on gravatar specs.
const gravatar = require('gravatar');

// Load User model.
const User = require('../../models/User');

// Import bcrypt module: library to hash passwords.
const bcrypt = require('bcryptjs');

// Import jsonwebtoken module: implementation of JSON Web Tokens.
const jwt = require('jsonwebtoken');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    // Verify if name exists in request.
    check('name', 'Your name is required.')
      .not()
      .isEmpty(),
    // Verify if email must be an email.
    check('email', 'Please provide a valid email address.').isEmail(),
    // Verify if password must be at least 6 chars long.
    check(
      'password',
      'Your password must be at least 6 characters in length.'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Destructuring assignment from request.
    const { name, email, password } = req.body;

    try {
      // Asynchronously finds e-mail and check if e-mail is in use.
      let user = await User.findOne({ email });
      if (user) {
        return res.status(409).json({
          errors: [{ message: 'E-mail already in use.' }]
        });
      }

      // Request Gravatar image
      const avatar = gravatar.url(email, { s: '200', d: 'mp' });

      // Construct Document: new instance of User model.
      user = new User({ name, email, avatar, password });

      // Asynchronously generates a salt.
      const salt = await bcrypt.genSalt(10);

      // Asynchronously generates a hash for the given string.
      user.password = await bcrypt.hash(password, salt);

      // Asynchronously save user document to database.
      await user.save();

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

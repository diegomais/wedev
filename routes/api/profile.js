// Import Express module: web application framework.
const express = require('express');

// Creates a new router object.
const router = express.Router();

// Load authentication middleware.
const auth = require('../../middleware/auth');

// Import express-validator module: middlewares that wraps validator.js functions.
const { check, validationResult } = require('express-validator/check');

// Load Profile model.
const Profile = require('../../models/Profile');

// @route    GET api/profile/me
// @desc     Get current user profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    // Find profile document and populate it with name and avatar from user collerction
    // by passing fields name and avatar syntax as the second argument to the populate method.
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    // If no profile is returned from database return with a message.
    if (!profile)
      return res
        .status(400)
        .json({ message: 'There is no profile for this user.' });

    // Or return the profile from database.
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server error.');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      // Verify if status exists in request.
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      // Verify if skills exists in request.
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions.
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array()
      });

    // Destructuring assignment from request.
    const {
      company,
      website,
      location,
      bio,
      status,
      skills,
      github,
      linkedin,
      twitter,
      facebook,
      instagram,
      youtube
    } = req.body;

    // Build profile object.
    const profileNewData = {};
    profileNewData.user = req.user.id;
    if (company) profileNewData.company = company;
    if (website) profileNewData.website = website;
    if (location) profileNewData.location = location;
    if (bio) profileNewData.bio = bio;
    if (status) profileNewData.status = status;
    if (skills)
      profileNewData.skills = skills.split(',').map(skill => skill.trim());

    // Build socialMediaHandles object.
    profileNewData.socialMediaHandles = {};
    if (github) profileNewData.socialMediaHandles.github = github;
    if (linkedin) profileNewData.socialMediaHandles.linkedin = linkedin;
    if (twitter) profileNewData.socialMediaHandles.twitter = twitter;
    if (facebook) profileNewData.socialMediaHandles.facebook = facebook;
    if (instagram) profileNewData.socialMediaHandles.instagram = instagram;
    if (youtube) profileNewData.socialMediaHandles.youtube = youtube;

    try {
      // Find profile on database.
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update profile if profile exists on database.
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileNewData },
          { new: true }
        );

        return res.json(profile);
      }

      // Create profile if profile don't exists on database.
      profile = new Profile(profileNewData);
      await profile.save();

      return res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

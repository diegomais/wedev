// Import Express module: web application framework.
const express = require('express');

// Creates a new router object.
const router = express.Router();

// Load authentication middleware.
const auth = require('../../middleware/auth');

// Import express-validator module: middlewares that wraps validator.js functions.
const { check, validationResult } = require('express-validator/check');

// Import request package: simplest way possible to make http calls.
// It supports HTTPS and follows redirects by default.
const request = require('request');

// Load Profile model.
const Profile = require('../../models/Profile');

// @route    GET api/profile/me
// @desc     Get current user profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    // Find profile document and populate it with name and avatar from user collection
    // by passing fields name and avatar syntax as the second argument to the populate method.
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    // If no profile is returned from database return with a message.
    if (!profile)
      return res
        .status(404)
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
      return res.status(500).send('Server error');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    // Find all profiles documents and populate them with name and avatar from user collection
    // by passing fields name and avatar syntax as the second argument to the populate method.
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    return res.json(profiles);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server error.');
  }
});

// @route    GET api/profile/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/:user_id', async (req, res) => {
  try {
    // Find profile document by user_id and populate it with name and avatar from user collection
    // by passing fields name and avatar syntax as the second argument to the populate method.
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile)
      return res.status(404).json({ message: 'Profile not found.' });

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    // Handle cast error on find when objectId is invalid.
    if (error.kind == 'ObjectId') {
      return res.status(404).json({
        message: 'Profile not found.'
      });
    }
    return res.status(500).send('Server error.');
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // TODO: Remove users posts.

    // Remove profile.
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove user.
    await User.findOneAndRemove({ _id: req.user.id });

    return res.json({ message: 'User deleted.' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server error.');
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/experience',
  [
    auth,
    [
      // Verify if title exists in request.
      check('title', 'Title is required.')
        .not()
        .isEmpty(),
      // Verify if company exists in request.
      check('company', 'Company is required.')
        .not()
        .isEmpty(),
      // Verify if startDate exists in request.
      check('startDate', 'Start date is required.')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions.
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Destructuring assignment from body of request.
    const {
      title,
      company,
      location,
      description,
      startDate,
      endDate,
      current
    } = req.body;

    // Build newExperience object with data from body of request.
    const newExperience = {
      title,
      company,
      location,
      description,
      startDate,
      endDate,
      current
    };

    try {
      // Find profile on database using id from user authenticated.
      const profile = await Profile.findOne({ user: req.user.id });

      // Add object to the beginning of experience array.
      profile.experience.unshift(newExperience);

      // Save the changes on database.
      await profile.save();

      // Return the updated profile.
      return res.json(profile);
    } catch (error) {
      // Outputs the error message to the Web Console.
      console.error(error.message);
      // Return 500 Internal Server Error response code: Indicates that the server encountered an
      // unexpected condition that prevented it from fulfilling the request. */
      return res.status(500).send('Internal Server Error.');
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    // Find profile on database using id from user authenticated.
    const profile = await Profile.findOne({ user: req.user.id });

    // Get index of the experience to remove from experience array.
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    // Remove the index finded above from experience array.
    profile.experience.splice(removeIndex, 1);

    // Save the changes on database.
    await profile.save();

    // Return the updated profile.
    return res.json(profile);
  } catch (error) {
    // Outputs the error message to the Web Console.
    console.error(error.message);
    // Return 500 Internal Server Error response code: Indicates that the server encountered an
    // unexpected condition that prevented it from fulfilling the request. */
    return res.status(500).send('Internal Server Error.');
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/education',
  [
    auth,
    [
      // Verify if school exists in request.
      check('school', 'School is required.')
        .not()
        .isEmpty(),
      // Verify if degree exists in request.
      check('degree', 'Degree is required.')
        .not()
        .isEmpty(),
      // Verify if fieldOfStudy exists in request.
      check('fieldOfStudy', 'Field of study is required.')
        .not()
        .isEmpty(),
      // Verify if startDate exists in request.
      check('startDate', 'Start date is required.')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // Find the validation errors in this request and wraps them in an object with handy functions.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring assignment from body of request.
    const {
      school,
      degree,
      fieldOfStudy,
      description,
      startDate,
      endDate,
      current
    } = req.body;

    // Build newEducation object with data from body of request.
    const newEducation = {
      school,
      degree,
      fieldOfStudy,
      description,
      startDate,
      endDate,
      current
    };

    try {
      // Find profile on database using id from user authenticated.
      const profile = await Profile.findOne({ user: req.user.id });

      // Add object to the beginning of education array.
      profile.education.unshift(newEducation);

      // Save the changes on database.
      await profile.save();

      // Return the updated profile.
      return res.json(profile);
    } catch (error) {
      // Outputs the error message to the Web Console.
      console.error(error.message);
      // Return 500 Internal Server Error response code: Indicates that the server encountered an
      // unexpected condition that prevented it from fulfilling the request. */
      return res.status(500).send('Internal Server Error.');
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    // Find profile on database using id from user authenticated.
    const profile = await Profile.findOne({ user: req.user.id });

    // Get index of the education to remove from education array.
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    // Remove the index finded above from education array.
    profile.education.splice(removeIndex, 1);

    // Save the changes on database.
    await profile.save();

    // Return the updated profile.
    return res.json(profile);
  } catch (error) {
    // Outputs the error message to the Web Console.
    console.error(error.message);
    // Return 500 Internal Server Error response code: Indicates that the server encountered an
    // unexpected condition that prevented it from fulfilling the request. */
    return res.status(500).send('Internal Server Error.');
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', (req, res) => {
  try {
    // Create a constant reference to githubClientId declared on environment variables.
    const githubClientId = process.env.GITHUB_CLIENT_ID;

    // Create a constant reference to githubClientId declared on environment variables.
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

    // Request a list of repositories owned by the username with 5 results per page
    // in ascending order of creation. Using GET method and user-agent header required.
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      // Outputs the error message to the Web Console.
      if (error) console.error(error);

      // Return message when response status differ of 200 OK success status response code:
      // Indicates that the request has succeeded.
      if (response.statusCode !== 200)
        return res.status(404).json({
          message: `We couldn’t find any user matching '${
            req.params.username
          }'.`
        });

      // Return the 5 last repos .
      return res.json(JSON.parse(body));
    });
  } catch (error) {
    // Outputs the error message to the Web Console.
    console.error(error.message);
    // Return 500 Internal Server Error response code: Indicates that the server encountered an
    // unexpected condition that prevented it from fulfilling the request. */
    return res.status(500).send('Internal Server Error.');
  }
});

module.exports = router;

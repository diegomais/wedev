// Import jsonwebtoken module: implementation of JSON Web Tokens.
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get authorization header from request.
  const authHeader = req.headers.authorization;

  // Check if exists authorization header.
  if (!authHeader)
    return res.status(401).send({ message: 'No token specified.' });

  // Check authorization header format.
  const parts = authHeader.split(' ');
  if (parts.length !== 2)
    return res.status(401).send({ message: 'Token bad formated.' });

  // Check authorization header scheme.
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ message: 'Token not valid.' });

  // Verify token itself.
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load decoded user to request.
    req.user = decoded.user;

    // Keep processing the request.
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token expired or not valid.' });
  }
};

const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Authentication invalid' });
  }

  const token = authHeader.split(' ')[1]; // Get the token part

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Authentication invalid' });
  }
};

module.exports = auth;
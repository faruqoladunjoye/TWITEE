const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

const generateToken = (user) => {
  const payload = {
    userId: user._Id,
    email: user.email,
  };
  return jwt.sign(payload, secretKey, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};

const jwt = require("jsonwebtoken");

const generateToken = (userId, isAdmin) => {
  return jwt.sign(
    {
      userInfo: {
        userId,
        isAdmin,
      },
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

module.exports = generateToken;

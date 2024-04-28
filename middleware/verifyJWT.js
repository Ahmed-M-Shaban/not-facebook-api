const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ApiError = require("../utils/apiError");

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return next(new ApiError("Forbidden", 403));
  }

  const user = await User.findById(decoded.userInfo.userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //  check for password changing here

  req.userId = decoded.userInfo.userId;
  req.isAdmin = decoded.userInfo.isAdmin;

  next();
};

module.exports = verifyJWT;

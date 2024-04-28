const ApiError = require("../utils/apiError");

const allowedTo =
  (...roles) =>
  (req, res, next) => {
    let role = req.isAdmin ? "admin" : "user";

    if (!roles.includes(role)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  };

module.exports = allowedTo;

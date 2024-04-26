const bcrypt = require("bcrypt");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  // spread fields
  const { username, email, password } = req.body;

  // data confirmation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // duplicate checking
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    return res
      .status(409)
      .json({ message: "There is already user with the same info" });
  }

  // password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  // create new user with hashed password
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  // if something went wrong
  if (!user) {
    return res.status(400).json({ message: "Wrong Info" });
  }

  // response
  const token = generateToken(user._id, user.isAdmin);
  const { password: hashed, ...userDoc } = user._doc;
  res.status(201).json({ token, ...userDoc });
};

const login = async (req, res) => {
  // speared fields
  const { email, password } = req.body;

  // data confirmation
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  // search for the user
  const user = await User.findOne({ email }).exec();

  // user not found
  if (!user) {
    return res.status(401).json({ message: "email or password is incorrect" });
  }

  // password checking
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "email or password is incorrect" });
  }

  // response
  const token = generateToken(user._id, user.isAdmin);
  const { password: hashed, ...userDoc } = user._doc;
  res.status(200).json({ token, ...userDoc });
};

module.exports = {
  register,
  login,
};

const bcrypt = require("bcrypt");

const User = require("../models/User");
const ApiError = require("../utils/apiError");

const updateUser = async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  const {
    username,
    email,
    password,
    profilePicture,
    coverPicture,
    desc,
    city,
    from,
    relationship,
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      username,
      email,
      password,
      profilePicture,
      coverPicture,
      desc,
      city,
      from,
      relationship,
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("Something went wrong", 400));
  }

  res.status(200).json({ message: "Your account has been updated" });
};

const deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.userId);
  if (!user) {
    return res.status(400).json({ message: "Something went wrong" });
  }
  res.status(204).send();
};

const getUser = async (req, res, next) => {
  const user = await User.findById(req.userId, {
    password: 0,
    __v: 0,
    updatedAt: 0,
  });
  res.status(200).json(user);
};

const followUser = async (req, res, next) => {
  if (req.userId.toString() === req.params.id) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  const followedUser = await User.findById(req.params.id);
  const currentUser = await User.findById(req.userId);

  if (!followedUser) {
    return res.status(404).json({ message: "This user has no longer exist" });
  }
  if (!currentUser) {
    return res.status(400).json({ message: "Something went wrong" });
  }

  if (followedUser.followers.includes(req.userId)) {
    return res.status(409).json({ message: "You allready follow this user" });
  }

  await followedUser.updateOne({ $push: { followers: req.userId } });
  await currentUser.updateOne({ $push: { followings: req.params.id } });

  res.status(200).json({
    messsage: `${followedUser.username.split(" ")[0]} has been followed`,
  });
};

const unfollowUser = async (req, res, next) => {
  if (req.userId.toString() === req.params.id) {
    return res.status(400).json({ message: "You can't unfollow yourself" });
  }

  const followedUser = await User.findById(req.params.id);
  const currentUser = await User.findById(req.userId);

  if (!followedUser) {
    return res.status(404).json({ message: "This user has no longer exist" });
  }
  if (!currentUser) {
    return res.status(400).json({ message: "Something went wrong" });
  }

  if (!followedUser.followers.includes(req.userId)) {
    return res.status(409).json({ message: "You are not follow this user" });
  }

  await followedUser.updateOne({ $pull: { followers: req.userId } });
  await currentUser.updateOne({ $pull: { followings: req.params.id } });

  res.status(200).json({
    messsage: `${followedUser.username.split(" ")[0]} has been unfollowed`,
  });
};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
};

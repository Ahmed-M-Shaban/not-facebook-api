const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res, next) => {
  req.body.user = req.userId;

  if (!req.body.desc && !req.body.img) {
    return res.status(400).json({ message: "You can't make empty post" });
  }

  const post = await Post.create(req.body);

  if (!post) {
    return res.status(400).json({ message: "Something went wrong" });
  }

  return res.status(200).json(post);
};

const updatePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "This post is no longer exist" });
  }

  if (post.user.toString() !== req.userId.toString()) {
    return res.status(403).json({ message: "You can't update this post" });
  }

  await post.updateOne({ $set: req.body });
  res.status(200).json({ message: "post has been updated successfully" });
};

const deletePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "This post is no longer exist" });
  }

  if (post.user.toString() !== req.userId.toString()) {
    return res.status(403).json({ message: "You can't delete this post" });
  }

  await post.deleteOne();
  res.status(200).json({ message: "post has been deleted successfully" });
};

const likePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "This post has no longer exist" });
  }

  if (post.likes.includes(req.userId)) {
    await post.updateOne({ $pull: { likes: req.userId } });
    return res.status(200).json({ message: "The post has been unliked" });
  }

  await post.updateOne({ $push: { likes: req.userId } });
  res.status(200).json({ message: "The post has been liked" });
};

const getPost = async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate({
    path: "user",
    select: "username profilePicture",
  });

  if (!post) {
    return res.status(404).json({ message: "This post has no longer exist" });
  }

  res.status(200).json(post);
};

const timeline = async (req, res, next) => {
  const user = await User.findById(req.userId);

  const userPosts = await Post.find({ user: req.userId }).populate({
    path: "user",
    select: "username profilePicture",
  });
  const friendsPosts = await Promise.all(
    user.followings.map((friend) =>
      Post.find({ user: friend }).populate({
        path: "user",
        select: "username profilePicture",
      })
    )
  );

  const timeline = userPosts.concat(...friendsPosts);

  for (let i = timeline.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [timeline[i], timeline[j]] = [timeline[j], timeline[i]];
  }

  res.status(200).json({ data: timeline });
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
  timeline,
};

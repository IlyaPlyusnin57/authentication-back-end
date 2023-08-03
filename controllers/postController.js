const Post = require("../models/PostModel");

async function createPost(req, res, next) {
  const { userId, text } = req.body;

  try {
    const post = await Post.create({
      userId,
      text,
    });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function findPosts(req, res, next) {
  const { userId } = req.params;

  try {
    const posts = await Post.find({
      userId,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const { deletedCount } = await Post.deleteOne({
      _id: req.params.postId,
      userId: req.body.userId,
    });

    if (deletedCount === 1) {
      return res.status(200).json(true);
    }

    res.status(404).json(false);
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = { createPost, findPosts, deletePost };

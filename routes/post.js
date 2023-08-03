const {
  createPost,
  findPosts,
  deletePost,
} = require("../controllers/postController");

const { verifyAccessToken } = require("../controllers/authController");

const router = require("express").Router();

router.use(verifyAccessToken);

router.post("/post", createPost);
router.get("/find/:userId", findPosts);
router.delete("/delete/:postId", deletePost);

module.exports = router;

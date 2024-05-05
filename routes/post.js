const router = require("express").Router();

const verifyJWT = require("../middleware/verifyJWT");
const {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
  timeline,
} = require("../controllers/post");

router.get("/:id", getPost);

router.use(verifyJWT);

router.post("/", createPost);
router.route("/:id").put(updatePost).delete(deletePost);
router.put("/like/:id", likePost);
router.get("/timeline/all", timeline);

module.exports = router;

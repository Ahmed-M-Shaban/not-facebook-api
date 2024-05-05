const router = require("express").Router();

const verifyJWT = require("../middleware/verifyJWT");
const allowedTo = require("../middleware/allowedTo");
const {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
} = require("../controllers/user");

router.use(verifyJWT);

//  @route    /api/v1/users/
//  @desc     update, delete, and get user profile
//  @roles    private
//  @method   put, delete, get
router.route("/").put(updateUser).delete(deleteUser).get(getUser);

//  @route    /api/v1/users/follow/:id
//  @desc     follow user
//  @roles    private
//  @method   put
router.route("/follow/:id").put(allowedTo("user"), followUser);

//  @route    /api/v1/users/unfollow/:id
//  @desc     unfollow user
//  @roles    private
//  @method   put
router.route("/unfollow/:id").put(allowedTo("user"), unfollowUser);

module.exports = router;

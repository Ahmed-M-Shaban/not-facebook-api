const router = require("express").Router();

const { register, login } = require("../controllers/auth");

//  @route  /api/v1/register
//  @desc   create new account
//  @roles  public
router.post("/register", register);

//  @route  /api/v1/login
//  @desc   login to user account
//  @roles  public
router.post("/login", login);

module.exports = router;

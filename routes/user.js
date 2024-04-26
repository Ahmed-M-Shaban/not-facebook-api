const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ name: "ahmed" });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const restrictJwt = require("../middleware/restrictJwt");

const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);

router.get("/authenticate", restrictJwt, (req, res) => {
  res.status(200).json({
    message: "sukses",
  });
});

module.exports = router;

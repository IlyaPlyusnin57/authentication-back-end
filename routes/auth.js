const {
  login,
  logout,
  register,
  checkUsername,
  checkEmail,
} = require("../controllers/userController");

const { refreshToken } = require("../controllers/authController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout/:id", logout);
router.post("/checkUsername", checkUsername);
router.post("/checkEmail", checkEmail);
router.post("/refresh", refreshToken);

module.exports = router;

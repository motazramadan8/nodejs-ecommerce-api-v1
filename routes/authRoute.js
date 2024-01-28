const express = require("express");

const {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signup);

router.post("/login", loginValidator, login);

router.post("/forgotPassword", forgotPassword);

router.post("/verifyResetCode", verifyResetCode);

router.put("/resetPassword", resetPassword);

module.exports = router;

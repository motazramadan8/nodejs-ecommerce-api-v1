const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const ApiError = require("../utils/apiError");
const { generateToken } = require("../middlewares/generateToken");

/**
 * @desc   Signup
 * @route  /api/v1/auth/signup
 * @method POST
 * @access public
 */
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = generateToken({ userId: user._id });

  res.status(201).json({ data: user, token });
});

/**
 * @desc   Login
 * @route  /api/v1/auth/login
 * @method POST
 * @access public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const token = generateToken({ userId: user._id });

  res.status(200).json({ data: user, token });
});

/**
 * @desc   Make sure the user is logged in
 */
exports.protect = asyncHandler(async (req, res, next) => {
  // Check if token exists, if exists catch it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("You are not logged in to access this, Please login", 401)
    );
  }

  // Verify token (no change happens, not expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Check if user exists
  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new ApiError("User that belong to this token does no longer exist", 401)
    );
  }

  // Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently change his password, please login again...",
          401
        )
      );
    }
  }

  // Add current user to req to access it in authorization
  req.user = currentUser;
  next();
});

/**
 * @desc   Make sure the user is active
 */
exports.protectActive = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);

  // Check if user is active
  if (!currentUser.active) {
    return next(
      new ApiError("You are not active please active your account", 401)
    );
  }

  next();
});

/**
 * @desc   Make sure the user is admin or manger or user - Authorization (User Permissions)
 */
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // Check if user has role that in parameters & Access registered user => (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

/**
 * @desc   Forget password
 * @route  /api/v1/auth/forgotPassword
 * @method POST
 * @access public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Get user by E-mail
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email: ${req.body.email}`, 404)
    );
  }

  // If user exists, Generate hash reset random code 6 digits and save it in DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed reset code into DB
  user.passwordResetCode = hashedResetCode;

  // Add expiration time for password reset code (10 minutes)
  user.passwordResetExp = Date.now() + 10 * 60 * 1000;

  user.passwordResetVerified = false;

  await user.save();

  // Send the reset code to user via email
  const message = `Hi ${user.name},\n\n We received a request to reset the password on your QuickMart Account. \n\n ${resetCode} \n\n Enter this code to complete reset. \n\n Thanks for helping us keep your account secure. \n QuickMart Team.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 minutes)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExp = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

/**
 * @desc   Verify reset code
 * @route  /api/v1/auth/verifyResetCode
 * @method POST
 * @access public
 */
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExp: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid reset code or expired", 400));
  }

  // If reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

/**
 * @desc   Reset password
 * @route  /api/v1/auth/resetPassword
 * @method POST
 * @access public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email });

  // Check if user exists
  if (!user) {
    return next(
      new ApiError(`There is no user for this email ${req.body.email}`, 404)
    );
  }

  // Check if user verified reset password code
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.password;
  user.passwordResetCode = undefined;
  user.passwordResetExp = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // Generate token
  const token = generateToken({ userId: user._id });

  res.status(200).json({ token });
});

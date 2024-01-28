const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const handlerFactory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/multerMiddleware");
const { generateToken } = require("../middlewares/generateToken");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .toFile(`uploads/users/${filename}`);
    req.body.profileImage = filename;
  }

  next();
});

/**
 * @desc   Get All Users
 * @route  /api/v1/users
 * @method GET
 * @access private (Only Admin)
 */
exports.getUsers = handlerFactory.getAll(User);

/**
 * @desc   Get Specific User
 * @route  /api/v1/users/:id
 * @method GET
 * @access private (Only Admin)
 */
exports.getSpecificUser = handlerFactory.getOne(User);

/**
 * @desc   Create New User
 * @route  /api/v1/users
 * @method POST
 * @access private (Only Admin)
 */
exports.createUser = handlerFactory.createOne(User);

/**
 * @desc   Update Specific Users
 * @route  /api/v1/users/:id
 * @method PUT
 * @access private (Only Admin)
 */
exports.updateSpecificUsers = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

/**
 * @desc   Delete Specific Users
 * @route  /api/v1/users/:id
 * @method DELETE
 * @access private (Only Admin)
 */
exports.deleteSpecificUsers = handlerFactory.deleteOne(User);

/**
 * @desc   Get logged user data
 * @route  /api/v1/users/getMe
 * @method DELETE
 * @access private (logged in user)
 */
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

/**
 * @desc   Update logged in user password
 * @route  /api/v1/auth/updateMyPassword
 * @method PUT
 * @access private (logged in user)
 */
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // Update user password based on user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // Generate token
  const token = generateToken({ userId: user._id });

  // Send response
  res.status(200).json({ data: user, token });
});

/**
 * @desc   Update logged in user data (without password, role)
 * @route  /api/v1/auth/updateMe
 * @method PUT
 * @access private (logged in user)
 */
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

/**
 * @desc   Delete logged in user (Deactivated User)
 * @route  /api/v1/auth/deleteMe
 * @method DELETE
 * @access private (logged in user)
 */
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(200).json({ status: "Successed" });
});

/**
 * @desc   Activate user
 * @route  /api/v1/auth/activeMe
 * @method PUT
 * @access private (logged in user)
 */
exports.activeLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: true });
  res.status(200).json({ status: "Activated Successfully" });
});

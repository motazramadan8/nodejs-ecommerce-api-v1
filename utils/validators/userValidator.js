const { check, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email Already Exists"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),

  check("profileImage").optional(),

  check("role").optional(),

  validatorMiddleware,
];

exports.updateSpecificUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),

  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email Already Exists"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invlid phone number"),

  check("profileImage").optional(),

  check("role").optional(),

  validatorMiddleware,
];

exports.updateMySpecificUserValidator = [
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email Already Exists"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted EGY and KSA numbers"),

  validatorMiddleware,
];

exports.updatePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),

  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required"),

  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom(async (password, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user with id");
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        throw new Error("Incorrect current password");
      }

      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateMyPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required"),

  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom(async (password, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error("There is no user with id");
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        throw new Error("Incorrect current password");
      }

      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteSpecificUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

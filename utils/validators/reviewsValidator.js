const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings value is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value is must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id format")
    // Check if logged user create review before
    .custom((val, { req }) =>
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.updateSpecificReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format")
    // Check review ownership before update
    .custom((val, { req }) =>
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(`There is no review for this id ${val}`)
          );
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteSpecificReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format")
    // Check review ownership before update
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review for this id ${val}`)
            );
          }

          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to perform this action")
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];

const express = require("express");

const {
  getReviews,
  createReview,
  getSpecificReview,
  updateSpecificReviews,
  deleteSpecificReviews,
  createFilterObj,
  setProductIdAndUserIsToBody,
} = require("../services/reviewService");
const {
  createReviewValidator,
  updateSpecificReviewValidator,
  getReviewValidator,
  deleteSpecificReviewValidator,
} = require("../utils/validators/reviewsValidator");
const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdAndUserIsToBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(getReviewValidator, getSpecificReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateSpecificReviewValidator,
    updateSpecificReviews
  )
  .delete(
    authService.protect,
    authService.allowedTo("user", "admin", "manager"),
    deleteSpecificReviewValidator,
    deleteSpecificReviews
  );

module.exports = router;

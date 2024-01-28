const handlerFactory = require("./handlerFactory");
const Review = require("../models/reviewModel");

exports.setProductIdAndUserIsToBody = (req, res, next) => {
  // Create Nested route
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  next();
};

// Get Nested Route
// Get /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObj = filterObject;
  next();
};

/**
 * @desc   Get All Reviews
 * @route  /api/v1/reviews
 * @method GET
 * @access public
 */
exports.getReviews = handlerFactory.getAll(Review);

/**
 * @desc   Get Specific Review
 * @route  /api/v1/reviews/:id
 * @method GET
 * @access public
 */
exports.getSpecificReview = handlerFactory.getOne(Review);

/**
 * @desc   Create New Review
 * @route  /api/v1/reviews
 * @method POST
 * @access private (Logged in user - role: user)
 */
exports.createReview = handlerFactory.createOne(Review);

/**
 * @desc   Update Specific Review
 * @route  /api/v1/reviews/:id
 * @method PUT
 * @access private (Logged in user - role: user)
 */
exports.updateSpecificReviews = handlerFactory.updateOne(Review);

/**
 * @desc   Delete Specific Review
 * @route  /api/v1/reviews/:id
 * @method DELETE
 * @access private (Logged in user - role: Admin\Manager)
 */
exports.deleteSpecificReviews = handlerFactory.deleteOne(Review);

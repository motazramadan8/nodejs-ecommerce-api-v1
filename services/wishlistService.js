const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

/**
 * @desc   Add product to wishlist
 * @route  /api/v1/wishlist
 * @method POST
 * @access private (logged in user)
 */
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist",
    data: user.wishlist,
  });
});

/**
 * @desc   Remove product from wishlist
 * @route  /api/v1/wishlist/:productId
 * @method DELETE
 * @access private (logged in user)
 */
exports.removeProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist",
    data: user.wishlist,
  });
});

/**
 * @desc   Get logged user wishlist
 * @route  /api/v1/wishlist
 * @method GET
 * @access private (logged in user)
 */
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res
    .status(200)
    .json({
      status: "success",
      results: user.wishlist.length,
      data: user.wishlist,
    });
});

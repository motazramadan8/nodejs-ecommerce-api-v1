const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

/**
 * @desc   Add address
 * @route  /api/v1/address
 * @method POST
 * @access private (logged in user)
 */
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

/**
 * @desc   Remove address
 * @route  /api/v1/address/:addressId
 * @method DELETE
 * @access private (logged in user)
 */
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully",
    data: user.addresses,
  });
});

/**
 * @desc   Get logged user addresses
 * @route  /api/v1/address
 * @method GET
 * @access private (logged in user)
 */
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});

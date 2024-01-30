const handlerFactory = require("./handlerFactory");

const Coupon = require("../models/couponModel");

/**
 * @desc   Get All Coupons
 * @route  /api/v1/coupons
 * @method GET
 * @access private (Only Admin or Manager)
 */
exports.getCoupons = handlerFactory.getAll(Coupon);

/**
 * @desc   Get Specific Coupon
 * @route  /api/v1/coupons/:id
 * @method GET
 * @access private (Only Admin or Manager)
 */
exports.getSpecificCoupon = handlerFactory.getOne(Coupon);

/**
 * @desc   Create New Coupon
 * @route  /api/v1/coupons
 * @method POST
 * @access private (Only Admin or Manager)
 */
exports.createCoupon = handlerFactory.createOne(Coupon);

/**
 * @desc   Update Specific Coupon
 * @route  /api/v1/coupons/:id
 * @method PUT
 * @access private (Only Admin or Manager)
 */
exports.updateSpecificCoupon = handlerFactory.updateOne(Coupon);

/**
 * @desc   Delete Specific Coupon
 * @route  /api/v1/coupons/:id
 * @method DELETE
 * @access private (Only Admin or Manager)
 */
exports.deleteSpecificCoupon = handlerFactory.deleteOne(Coupon);

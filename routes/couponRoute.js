const express = require("express");

const router = express.Router();

const {
  createCouponValidator,
  getCouponValidator,
  updateSpecificCouponValidator,
  deleteSpecificCouponValidator,
} = require("../utils/validators/couponValidator");
const {
  getCoupons,
  createCoupon,
  getSpecificCoupon,
  updateSpecificCoupon,
  deleteSpecificCoupon,
} = require("../services/couponService");
const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCouponValidator, createCoupon);

router
  .route("/:id")
  .get(getCouponValidator, getSpecificCoupon)
  .put(updateSpecificCouponValidator, updateSpecificCoupon)
  .delete(deleteSpecificCouponValidator, deleteSpecificCoupon);

module.exports = router;

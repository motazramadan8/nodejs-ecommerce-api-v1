const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const Coupon = require("../../models/couponModel");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon is required")
    .isUppercase()
    .withMessage("Coupon must be uppercase")
    .isLength({ min: 5 })
    .withMessage("Too short coupon name")
    .isLength({ max: 50 })
    .withMessage("Too long coupon name")
    .custom((val) =>
      Coupon.findOne({ name: val }).then((couponName) => {
        if (couponName) {
          return Promise.reject(
            new Error(`There is already a coupon with name: ${couponName}`)
          );
        }
        return true;
      })
    ),
  check("expire")
    .notEmpty()
    .withMessage("Expire date is required")
    .isDate()
    .withMessage("Expiration must be date"),
  check("discount")
    .notEmpty()
    .withMessage("Discount is required")
    .isNumeric()
    .withMessage("Discount must be number"),
  validatorMiddleware,
];

exports.updateSpecificCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id format"),
  body("name")
    .optional()
    .isUppercase()
    .withMessage("Coupon must be uppercase")
    .custom((val) =>
      Coupon.findOne({ name: val }).then((couponName) => {
        if (couponName) {
          return Promise.reject(
            new Error(`There is already a coupon with name: ${couponName}`)
          );
        }
        return true;
      })
    ),
  check("expire").optional().isDate().withMessage("Expiration must be date"),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be number"),
  validatorMiddleware,
];

exports.deleteSpecificCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id format"),
  validatorMiddleware,
];

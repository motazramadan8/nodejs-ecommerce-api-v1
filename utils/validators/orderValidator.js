const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createCashOrderValidator = [
  check("cartId").isMongoId().withMessage("Invalid cart id format"),

  check("shippingAddress.details")
    .isString()
    .withMessage("Details must be a string")
    .isLength({ min: 10, max: 200 })
    .withMessage("Alias must be between 10 and 200 characters"),

  check("shippingAddress.phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),

  check("shippingAddress.city")
    .isString()
    .withMessage("Alias must be a string")
    .isLength({ min: 2, max: 30 })
    .withMessage("City must be between 2 and 30 characters"),

  check("shippingAddress.postalCode")
    .isString()
    .withMessage("Postal code must be a string")
    .matches(/^\d{5}$/)
    .withMessage("Invalid postal code"),

  validatorMiddleware,
];

exports.gitOrderAndUpdateOrderSettingsValidator = [
  check("id").isMongoId().withMessage("Invalid order id format"),
  validatorMiddleware,
];

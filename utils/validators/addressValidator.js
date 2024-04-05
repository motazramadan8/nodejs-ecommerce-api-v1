const { check, param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addAddressValidator = [
  check("alias")
    .isString()
    .withMessage("Alias must be a string")
    .isLength({ min: 2, max: 40 })
    .withMessage("Alias must be between 2 and 40 characters"),

  check("details")
    .isString()
    .withMessage("Details must be a string")
    .isLength({ min: 10, max: 200 })
    .withMessage("Alias must be between 10 and 200 characters"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),

  check("city")
    .isString()
    .withMessage("Alias must be a string")
    .isLength({ min: 2, max: 30 })
    .withMessage("Alias must be between 2 and 30 characters"),

  check("postalCode")
    .isString()
    .withMessage("Postal code must be a string")
    .matches(/^\d{5}$/)
    .withMessage("Invalid postal code"),

  validatorMiddleware,
];

exports.removeAddressValidator = [
  param("addressId")
    .isMongoId()
    .withMessage("Invalid address id format")
    .custom((value, { req }) => {
      let addressWillRemoved = null;
      req.user.addresses.forEach((address) => {
        if (address._id.toString() === value) {
          addressWillRemoved = value;
        }
      });
      if (addressWillRemoved === null) {
        return Promise.reject(
          new Error(`No product for this id: ${value} in your address list`)
        );
      }
      return true;
    }),
  validatorMiddleware,
];

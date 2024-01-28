const { body, param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const Product = require("../../models/productModel");

exports.addProductToWishlistValidator = [
  body("productId")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom((value) =>
      Product.findOne({ _id: value }).then((product) => {
        if (!product) {
          return Promise.reject(new Error(`No product for this id: ${value}`));
        }
      })
    ),
  validatorMiddleware,
];

exports.removeProductFromWishlistValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom((value, { req }) => {
      if (!req.user.wishlist.includes(value)) {
        return Promise.reject(
          new Error(`No product for this id: ${value} in your wishlist`)
        );
      }
      return true;
    }),
  validatorMiddleware,
];

const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name is required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to main category")
    .isMongoId()
    .withMessage("Invalid category id format"),
  validatorMiddleware,
];

exports.updateSpecificSubCategoriesValidator = [
  check("id")
    .notEmpty()
    .withMessage("subCategory id is required")
    .isMongoId()
    .withMessage("Invalid subCategory id format"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
  validatorMiddleware,
];

exports.deleteSpecificSubCategoriesValidator = [
  check("id")
    .notEmpty()
    .withMessage("subCategory id is required")
    .isMongoId()
    .withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];

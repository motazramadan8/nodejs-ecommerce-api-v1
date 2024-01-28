const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
const checker = require("../../middlewares/checker");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Too short product title")
    .notEmpty()
    .withMessage("Product is required")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long product description title"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("product price must be a number")
    .isLength({ max: 20 })
    .withMessage("Too long product price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("priceAfterDescount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDescount must be lower than product price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors shoud be array of strings"),
  check("imageCover").notEmpty().withMessage("Product image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images shoud be array of strings"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid mongo id format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No Category for this id: ${categoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid mongo id format")
    .custom((subcategoryIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoryIds } }).then(
        (subcategories) => {
          if (new Set(subcategoryIds).size !== subcategoryIds.length) {
            return Promise.reject(
              new Error(`There is many subcategories with the same IDs`)
            );
          }
          if (
            subcategories.length < 1 ||
            subcategories.length !== subcategoryIds.length
          ) {
            return Promise.reject(new Error(`No SubCategories for these ids`));
          }
        }
      )
    )
    .custom((value, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdInDB.push(subCategory._id.toString());
          });

          if (!checker(value, subCategoriesIdInDB)) {
            return Promise.reject(
              new Error(`No SubCategories for this Category`)
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("Invalid mongo id format"),
  check("rateingsAverage")
    .optional()
    .isNumeric()
    .withMessage("RateingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("rateingsAverage")
    .optional()
    .isNumeric()
    .withMessage("RateingsAverage must be a number"),
  check("rateingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("RateingsQuantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

exports.updateSpecificProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  body("title")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
  validatorMiddleware,
];

exports.deleteSpecificProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];

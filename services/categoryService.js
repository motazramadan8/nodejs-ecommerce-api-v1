const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const handlerFactory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/multerMiddleware");
const Category = require("../models/categoryModel");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `categories-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 94 })
      .toFile(`uploads/categories/${filename}`);
  }
  req.body.image = filename;

  next();
});

/**
 * @desc   Get All Categories
 * @route  /api/v1/categories
 * @method GET
 * @access public
 */

exports.getCategories = handlerFactory.getAll(Category);

/**
 * @desc   Get Specific Category
 * @route  /api/v1/categories/:id
 * @method GET
 * @access public
 */
exports.getSpecificCategory = handlerFactory.getOne(Category);

/**
 * @desc   Create New Category
 * @route  /api/v1/categories
 * @method POST
 * @access private (Only Admin or Manager)
 */
exports.createCategory = handlerFactory.createOne(Category);

/**
 * @desc   Update Specific Category
 * @route  /api/v1/categories/:id
 * @method PUT
 * @access private (Only Admin or Manager)
 */
exports.updateSpecificCategories = handlerFactory.updateOne(Category);

/**
 * @desc   Delete Specific Category
 * @route  /api/v1/categories/:id
 * @method DELETE
 * @access private (Only Admin)
 */
exports.deleteSpecificCategories = handlerFactory.deleteOne(Category);

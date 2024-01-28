const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const handlerFactory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/multerMiddleware");
const Brand = require("../models/brandModel");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brands-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 94 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;

  next();
});

/**
 * @desc   Get All Brands
 * @route  /api/v1/brands
 * @method GET
 * @access public
 */
exports.getBrands = handlerFactory.getAll(Brand);

/**
 * @desc   Get Specific Brand
 * @route  /api/v1/brands/:id
 * @method GET
 * @access public
 */
exports.getSpecificBrand = handlerFactory.getOne(Brand);

/**
 * @desc   Create New Brand
 * @route  /api/v1/brands
 * @method POST
 * @access private (Only Admin or Manager)
 */
exports.createBrand = handlerFactory.createOne(Brand);

/**
 * @desc   Update Specific Brand
 * @route  /api/v1/brands/:id
 * @method PUT
 * @access private (Only Admin or Manager)
 */
exports.updateSpecificBrands = handlerFactory.updateOne(Brand);

/**
 * @desc   Delete Specific Brand
 * @route  /api/v1/brands/:id
 * @method DELETE
 * @access private (Only Admin)
 */
exports.deleteSpecificBrands = handlerFactory.deleteOne(Brand);

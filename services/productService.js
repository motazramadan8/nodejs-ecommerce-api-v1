const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const handlerFactory = require("./handlerFactory");
const { uploadMixOfImages } = require("../middlewares/multerMiddleware");
const Product = require("../models/productModel");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // Image Proccessing For Image Cover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }
  // Image Proccessing For Images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );
    next();
  }
});

/**
 * @desc   Get All Products
 * @route  /api/v1/products
 * @method GET
 * @access public
 */
exports.getProducts = handlerFactory.getAll(Product, "Products");

/**
 * @desc   Get Specific Product
 * @route  /api/v1/products/:id
 * @method GET
 * @access public
 */
exports.getSpecificProduct = handlerFactory.getOne(Product, "reviews");

/**
 * @desc   Create New Product
 * @route  /api/v1/products
 * @method POST
 * @access private (Only Admin or Manager)
 */
exports.createProduct = handlerFactory.createOne(Product);

/**
 * @desc   Update Specific Product
 * @route  /api/v1/products/:id
 * @method PUT
 * @access private (Only Admin or Manager)
 */
exports.updateSpecificProduct = handlerFactory.updateOne(Product);

/**
 * @desc   Delete Specific Product
 * @route  /api/v1/products/:id
 * @method DELETE
 * @access private (Only Admin)
 */
exports.deleteSpecificProduct = handlerFactory.deleteOne(Product);

const express = require("express");
const {
  getProducts,
  createProduct,
  getSpecificProduct,
  updateSpecificProduct,
  deleteSpecificProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");
const {
  createProductValidator,
  getProductValidator,
  updateSpecificProductValidator,
  deleteSpecificProductValidator,
} = require("../utils/validators/productValidator");
const authService = require("../services/authService");
const reviewRoute = require("./reviewRoute");

const router = express.Router();

router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getSpecificProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateSpecificProductValidator,
    updateSpecificProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSpecificProductValidator,
    deleteSpecificProduct
  );

module.exports = router;

const express = require("express");

const router = express.Router();

const {
  getBrands,
  createBrand,
  getSpecificBrand,
  updateSpecificBrands,
  deleteSpecificBrands,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");
const {
  createBrandValidator,
  getBrandValidator,
  updateSpecificBrandValidator,
  deleteSpecificBrandValidator,
} = require("../utils/validators/brandValidator");
const authService = require("../services/authService");

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, getSpecificBrand)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateSpecificBrandValidator,
    updateSpecificBrands
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSpecificBrandValidator,
    deleteSpecificBrands
  );

module.exports = router;

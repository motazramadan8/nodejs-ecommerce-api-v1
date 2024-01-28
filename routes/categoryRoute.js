const express = require("express");

const router = express.Router();

const {
  getCategories,
  createCategory,
  getSpecificCategory,
  updateSpecificCategories,
  deleteSpecificCategories,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateSpecificCategoriesValidator,
  deleteSpecificCategoriesValidator,
} = require("../utils/validators/categoryValidator");
const authService = require("../services/authService");

const subCategoryRoute = require("./subCategoryRoute");

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getSpecificCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateSpecificCategoriesValidator,
    updateSpecificCategories
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSpecificCategoriesValidator,
    deleteSpecificCategories
  );

module.exports = router;

const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSpecificSubCategory,
  updateSpecificSubCategories,
  deleteSpecificSubCategories,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSpecificSubCategoriesValidator,
  deleteSpecificSubCategoriesValidator,
} = require("../utils/validators/subCategoryValidator");
const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getSubCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSpecificSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    updateSpecificSubCategoriesValidator,
    updateSpecificSubCategories
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSpecificSubCategoriesValidator,
    deleteSpecificSubCategories
  );

module.exports = router;

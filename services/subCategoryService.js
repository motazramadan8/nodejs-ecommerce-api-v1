const SubCategory = require("../models/subCategoryModel");
const handlerFactory = require("./handlerFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  // Create Nested route
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// Get Nested Route
// Get /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObj = filterObject;
  next();
};

/** -----------------------------------
 * @desc   Get All Sub Categories
 * @route  /api/v1/subcategories
 * @method GET
 * @access public
-----------------------------------*/
exports.getSubCategories = handlerFactory.getAll(SubCategory);

/** -----------------------------------
 * @desc   Get Specific Sub Category
 * @route  /api/v1/subcategories/:id
 * @method GET
 * @method public
-----------------------------------*/
exports.getSpecificSubCategory = handlerFactory.getOne(SubCategory);

/** -----------------------------------
 * @desc   Create New SubCategory
 * @route  /api/v1/subcategories
 * @method POST
 * @access private (Only Admin or Manager)
-----------------------------------*/
exports.createSubCategory = handlerFactory.createOne(SubCategory);

/** -----------------------------------
 * @desc   Update Specific Sug Category
 * @route  /api/v1/subcategories/:id
 * @method PUT
 * @access private (Only Admin or Manager)
-----------------------------------*/
exports.updateSpecificSubCategories = handlerFactory.updateOne(SubCategory);

/** -----------------------------------
 * @desc   Delete Specific Sub Category
 * @route  /api/v1/subcategories/:id
 * @method DELETE
 * @access private (Only Admin)
-----------------------------------*/
exports.deleteSpecificSubCategories = handlerFactory.deleteOne(SubCategory);

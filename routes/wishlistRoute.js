const express = require("express");

const {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator,
} = require("../utils/validators/wishlistValidator");
const {
  addProductToWishlist,
  removeProductToWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .get(getLoggedUserWishlist)
  .post(addProductToWishlistValidator, addProductToWishlist);

router.delete(
  "/:productId",
  removeProductFromWishlistValidator,
  removeProductToWishlist
);

module.exports = router;

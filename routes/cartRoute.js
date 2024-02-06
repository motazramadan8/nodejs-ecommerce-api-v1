const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  deleteCartItem,
  clearLoggedUserCart,
  updateCartItemQuantity,
} = require("../services/cartService");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearLoggedUserCart);

router.route("/:itemId").put(updateCartItemQuantity).delete(deleteCartItem);

module.exports = router;

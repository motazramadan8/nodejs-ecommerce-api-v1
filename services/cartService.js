const asyncHandler = require("express-async-handler");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");

const getTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((element) => {
    totalPrice += element.quantity * element.price;
  });
  cart.totalCartPrice = totalPrice;

  return totalPrice;
};

/**
 * @desc   Add product to cart
 * @route  /api/v1/cart
 * @method POST
 * @access private (logged in user)
 */
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);

  // Get cart for logged in user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create cart for user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product already exist in cart => update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart => add product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  // Calculate total cart price
  getTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added successfully",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc   Get logged user cart
 * @route  /api/v1/cart
 * @method GET
 * @access private (logged in user)
 */
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for user with id: ${userId}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc   Delete logged user cart item
 * @route  /api/v1/cart/:itemId
 * @method DELETE
 * @access private (logged in user)
 */
exports.deleteCartItem = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  if (!cart) {
    return next(
      new ApiError(`There is no cart for user with id: ${userId}`, 404)
    );
  }

  // Calculate total cart price
  getTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product removed successfully",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc   Clear logged user cart
 * @route  /api/v1/cart
 * @method DELETE
 * @access private (logged in user)
 */
exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOneAndDelete({ user: userId });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for user with id: ${userId}`, 404)
    );
  }

  res.status(204).send();
});

/**
 * @desc   Update cart item quantity
 * @route  /api/v1/cart/:itemId
 * @method PUT
 * @access private (logged in user)
 */
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for user with id: ${userId}`, 404)
    );
  }

  const productIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (productIndex > -1) {
    const cartItem = cart.cartItems[productIndex];
    cartItem.quantity = quantity;

    cart.cartItems[productIndex] = cartItem;
  } else {
    return next(
      new ApiError(
        `There is no product in cart with this id: ${req.params.itemId}`,
        404
      )
    );
  }

  // Calculate total cart price
  getTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product quantity updated successfully",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

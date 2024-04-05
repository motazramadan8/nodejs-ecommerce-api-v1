const asyncHandler = require("express-async-handler");

const handlerFactory = require("./handlerFactory");
const ApiError = require("../utils/apiError");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

/**
 * @desc   Create cash order
 * @route  /api/v1/orders/:cartId
 * @method POST
 * @access private (logged in user)
 */
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // App settings
  let taxPrice = 0;
  let shippingPrice = 0;

  // Get cart based on cartId from params
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with id: ${req.params.cartId}`, 404)
    );
  }

  // Set shipping price
  if (
    req.body.shippingAddress.city === "cairo" ||
    req.body.shippingAddress.city === "giza" ||
    req.body.shippingAddress.city === "alexandria"
  ) {
    shippingPrice = 20;
  } else {
    shippingPrice = 45;
  }

  // Get price of cart => user used coupon ? total price = cart.totalPriceAfterDiscount : cart.totalPrice
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  // Set tax price
  taxPrice = Math.ceil((cartPrice * 5) / 100);

  const totalCartPrice = cartPrice + shippingPrice + taxPrice;

  // Create order with default payment method => "cash"
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    taxPrice,
    shippingPrice,
    cartPrice,
    totalCartPrice,
  });

  // After creating order => decrement product quantity | increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOptions, {});

    // Clear user cart based on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  // Send response
  res.status(201).json({ message: "Your order has been sent", data: order });
});

exports.filterOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
/**
 * @desc   Get All Orders
 * @route  /api/v1/orders
 * @method GET
 * @access private (only admin | user)
 */
exports.gitAllOrders = handlerFactory.getAll(Order);

/**
 * @desc   Get Specific Order
 * @route  /api/v1/orders/:id
 * @method POST
 * @access private (only admins | user)
 */
exports.gitSpecificOrder = handlerFactory.getOne(Order);

/**
 * @desc   Update order paid status to paid
 * @route  /api/v1/orders/:id/pay
 * @method PUT
 * @access private (only admins | manager)
 */
exports.updateOrderPaidStatus = asyncHandler(async (req, res, next) => {
  // get order by params.id and update
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isPayed: true,
      paidAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // Validate order
  if (!order) {
    return next(
      new ApiError(`There is no order for this id: ${req.params.id}`, 404)
    );
  }

  // send data to client
  res.status(200).json({ message: "Order updated to paid", data: order });
});

/**
 * @desc   Update order delivered status
 * @route  /api/v1/orders/:id/deliver
 * @method PUT
 * @access private (only admins | manager)
 */
exports.updateOrderDeliverStatus = asyncHandler(async (req, res, next) => {
  // get order by params.id and update
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isDelivered: true,
      deliveredAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // Validate order
  if (!order) {
    return next(
      new ApiError(`There is no order for this id: ${req.params.id}`, 404)
    );
  }

  // send data to client
  res.status(200).json({ message: "Order updated to delivered", data: order });
});

const express = require("express");

const router = express.Router();

const {
  createCashOrderValidator,
  gitOrderAndUpdateOrderSettingsValidator,
} = require("../utils/validators/orderValidator");
const {
  createCashOrder,
  filterOrdersForLoggedUser,
  gitAllOrders,
  gitSpecificOrder,
  updateOrderPaidStatus,
  updateOrderDeliverStatus,
} = require("../services/orderService");

const authService = require("../services/authService");

router.use(authService.protect);

router
  .route("/:cartId")
  .post(
    authService.allowedTo("user"),
    createCashOrderValidator,
    createCashOrder
  );

router.get(
  "/",
  authService.allowedTo("user", "admin", "manager"),
  filterOrdersForLoggedUser,
  gitAllOrders
);

router.get(
  "/:id",
  authService.allowedTo("user", "admin", "manager"),
  gitOrderAndUpdateOrderSettingsValidator,
  filterOrdersForLoggedUser,
  gitSpecificOrder
);

router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  gitOrderAndUpdateOrderSettingsValidator,
  updateOrderPaidStatus
);

router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  gitOrderAndUpdateOrderSettingsValidator,
  updateOrderDeliverStatus
);

module.exports = router;

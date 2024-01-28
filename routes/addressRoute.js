const express = require("express");

const authService = require("../services/authService");
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/addressService");
const {
  addAddressValidator,
  removeAddressValidator,
} = require("../utils/validators/addressValidator");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .post(addAddressValidator, addAddress)
  .get(getLoggedUserAddresses);

router.delete("/:addressId", removeAddressValidator, removeAddress);

module.exports = router;

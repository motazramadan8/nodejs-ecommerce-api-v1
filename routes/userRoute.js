const express = require("express");

const {
  getUsers,
  createUser,
  getSpecificUser,
  updateSpecificUsers,
  deleteSpecificUsers,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
  activeLoggedUser,
} = require("../services/userService");

const {
  createUserValidator,
  getUserValidator,
  updateSpecificUserValidator,
  deleteSpecificUserValidator,
  updatePasswordValidator,
  updateMyPasswordValidator,
  updateMySpecificUserValidator,
} = require("../utils/validators/userValidator");
const authService = require("../services/authService");

const router = express.Router();

router.get(
  "/getMe",
  authService.protect,
  authService.protectActive,
  getLoggedUserData,
  getSpecificUser
);
router.put(
  "/updateMyPassword",
  authService.protect,
  authService.protectActive,
  updateMyPasswordValidator,
  updateLoggedUserPassword
);
router.put(
  "/updateMe",
  authService.protect,
  authService.protectActive,
  updateMySpecificUserValidator,
  updateLoggedUserData
);
router.delete(
  "/deleteMe",
  authService.protect,
  authService.protectActive,
  deleteLoggedUser
);
router.put("/activeMe", authService.protect, activeLoggedUser);

// Admin And Manager
router.put("/changePassword/:id", updatePasswordValidator, changeUserPassword);

router
  .route("/")
  .get(authService.protect, authService.allowedTo("admin", "manager"), getUsers)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(
    authService.protect,
    authService.allowedTo("admin"),
    getUserValidator,
    getSpecificUser
  )
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateSpecificUserValidator,
    updateSpecificUsers
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSpecificUserValidator,
    deleteSpecificUsers
  );

module.exports = router;

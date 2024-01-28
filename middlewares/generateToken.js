const jwt = require("jsonwebtoken");

exports.generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWR_EXPIRATION,
  });

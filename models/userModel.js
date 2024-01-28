const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Email must be unique"],
      unique: [true, "Email must be unique"],
      trim: true,
      lowercase: true,
    },

    phone: String,

    profileImage: String,

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Too short password"],
    },

    passwordChangedAt: Date,

    passwordResetCode: String,

    passwordResetExp: Date,

    passwordResetVerified: Boolean,

    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },

    // child reference (1 - m)
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],

    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: { type:String, unique: [true, "this phone used already"] },
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Create Model
const User = mongoose.model("User", UserSchema);

module.exports = User;

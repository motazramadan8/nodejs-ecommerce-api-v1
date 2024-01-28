const mongoose = require("mongoose");

// Create Schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "Too short subCategory name"],
      maxlength: [32, "Too logn subCategory name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to parent Category"],
    },
  },
  { timestamps: true }
);

// Create Model
module.exports = mongoose.model("SubCategory", subCategorySchema);

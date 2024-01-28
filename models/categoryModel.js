const mongoose = require("mongoose");

// Create Schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too logn category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

CategorySchema.post("init", (doc) => {
  setImageURL(doc);
});

CategorySchema.post("save", (doc) => {
  setImageURL(doc);
});

// Create Model
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;

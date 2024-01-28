const mongoose = require("mongoose");

// Create Schema
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand is required"],
      unique: [true, "Brand must be unique"],
      minlength: [2, "Too short brand name"],
      maxlength: [32, "Too logn brand name"],
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

BrandSchema.post("init", (doc) => {
  setImageURL(doc);
});

BrandSchema.post("save", (doc) => {
  setImageURL(doc);
});

// Create Model
module.exports = mongoose.model("Brand", BrandSchema);

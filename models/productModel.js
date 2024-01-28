const mongoose = require("mongoose");

// Create Schema
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product name"],
      maxlength: [100, "Too long product name"],
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },

    quantity: {
      type: Number,
      required: [true, "Product Quantity is required"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      trim: true,
      required: [true, "Price is required"],
      max: [200000, "Too long product price"],
    },

    priceAfterDiscount: {
      type: Number,
    },

    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },

    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to Category"],
    },

    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },

    rateingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal to 1.0"],
      max: [5, "Rating must be below or equal to 5.5"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const arrayOfImages = [];
    doc.images.forEach((productImage) => {
      const productImageUrl = `${process.env.BASE_URL}/products/${productImage}`;
      arrayOfImages.push(productImageUrl);
    });
    doc.images = arrayOfImages;
  }
};

ProductSchema.post("init", (doc) => {
  setImageURL(doc);
});

ProductSchema.post("save", (doc) => {
  setImageURL(doc);
});

// Create Model
module.exports = mongoose.model("Product", ProductSchema);

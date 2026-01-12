// server/src/models/product.model.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    gender: { type: String, enum: ["men", "women", "kids", "unisex"], required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String }  // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

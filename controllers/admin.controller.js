const router = require("express").Router();
const AllProducts = require("../models/allProducts.model");
const Order = require("../models/order.model");

// ✅ Admin Login (Static Credentials)
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    return res.status(200).json({ success: true, token: "admin-secret-token" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// ✅ Get All Products
router.get("/products", async (req, res) => {
  try {
    const products = await AllProducts.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add Product
router.post("/product", async (req, res) => {
  try {
    const newProduct = await AllProducts.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update Product
router.put("/product/:id", async (req, res) => {
  try {
    const updated = await AllProducts.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete Product
router.delete("/product/:id", async (req, res) => {
  try {
    const deleted = await AllProducts.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Stats
router.get("/stats", async (req, res) => {
  try {
    const totalProducts = await AllProducts.countDocuments();
    const totalOrders = await Order.countDocuments();
    res.json({ totalProducts, totalOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

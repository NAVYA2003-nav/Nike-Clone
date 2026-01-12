const express = require('express');
const app = express();
const cors = require('cors');

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000",   // if React runs on port 3000
  credentials: true
}));
app.use(express.json());

// ✅ Controllers
const { signup, login } = require('./controllers/auth.controller');
const menController = require("./controllers/men.controller");
const womenController = require("./controllers/women.controller");
const kidsController = require("./controllers/kids.controller");
const allProductsController = require("./controllers/allProducts.controller");
const clothDataController = require("./controllers/clothData.controller");
const shoeDataController = require("./controllers/shoeData.controller");
const favouriteController = require("./controllers/favourite.controller");
const paymentController = require('./controllers/payment.controller');
const orderController = require('./controllers/order.controller');
const adminController = require("./controllers/admin.controller"); // ✅ Admin routes added

// 🔹 Authentication
app.post("/signup", signup);
app.post("/login", login);

// 🔹 Razorpay Payment
app.use("/api/payment", paymentController);

// 🔹 Product APIs
app.use("/men", menController);
app.use("/women", womenController);
app.use("/kids", kidsController);
app.use("/allProducts", allProductsController);
app.use("/clothData", clothDataController);
app.use("/shoeData", shoeDataController);
app.use("/favourite", favouriteController);

// 🔹 Orders (COD + Razorpay)
app.use("/order", orderController);

// ✅ Admin APIs
app.use("/admin", adminController);

module.exports = app;

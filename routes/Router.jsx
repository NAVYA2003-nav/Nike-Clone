import { Route, Routes } from "react-router-dom";
import { AuthPage } from "../pages/auth/AuthPage";
import { Cart } from "../pages/cart/Cart";
import { Checkout } from "../pages/checkout/Checkout";
import { Description } from "../pages/description/Description";
import { Favourite } from "../pages/favourite/Favourite";
import { Footer } from "../pages/footer/Footer";
import { Home } from "../pages/home/Home";
import { Navbar } from "../pages/navbar/Navbar";
import { Order } from "../pages/orders/Order";
import { Private } from "./Private";
import { Public } from "./Public";

// ✅ Extra pages
import Payment from "../pages/payment/Payment";
import OrderSuccess from "../pages/orders/OrderSuccess";
import OrderHistory from "../pages/orders/OrderHistory";
import { Admin } from "../pages/admin/Admin";   // ✅ Import Admin

// ✅ Products + sessionStorage helper
import { Products } from "../pages/products/Products";
import { setItemSession } from "../utils/sessionStorage";

import { AdminPrivate } from "./AdminPrivate"; 
// In your Routes section
// ✅ Wrapper for products so correct "path" is stored
const ProductsWrapper = ({ category }) => {
  setItemSession("path", category);
  return <Products />;
};

export const Router = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Products with correct category */}
        <Route path="/allProducts" element={<ProductsWrapper category="allProducts" />} />
        <Route path="/men" element={<ProductsWrapper category="men" />} />
        <Route path="/women" element={<ProductsWrapper category="women" />} />
        <Route path="/kids" element={<ProductsWrapper category="kids" />} />

        {/* Description */}
        <Route path="/description/:id" element={<Description />} />

        {/* Auth & Protected */}
        <Route path="/auth" element={<Public><AuthPage /></Public>} />
        <Route path="/favourite" element={<Private><Favourite /></Private>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Private><Checkout /></Private>} />
        <Route path="/orders" element={<Private><Order /></Private>} />

        {/* Payment & Order success */}
        <Route path="/payment" element={<Private><Payment /></Private>} />
        <Route path="/order-success" element={<Private><OrderSuccess /></Private>} />

        {/* Order History */}
        <Route path="/order-history" element={<Private><OrderHistory /></Private>} />

        {/* ✅ Admin Page */}
        <Route path="/admin" element={<Private><Admin /></Private>} />
        <Route path="/admin" element={<Private><Admin /></Private>} />
      </Routes>

      <Footer />
    </>
  );
};

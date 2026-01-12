import axios from "axios";
import { updateCartDetails } from "../../redux/features/cart/actions";
import { setToast } from "../../utils/extraFunctions";
import { removeItem } from "../../utils/localstorage";

export const sendOrderRequest = async (
  shippingDetails,
  orderId,
  response,
  orderSummary,
  cartProducts,
  token,   // 👈 token is passed from Redux
  toast,
  dispatch,
  navigate
) => {
  const payload = {
    orderSummary,
    cartProducts,
    shippingDetails,
    paymentDetails: {
      orderId,
      razorpayOrderId: response?.razorpay_order_id || null,
      razorpayPaymentId: response?.razorpay_payment_id || "COD",
      method: response?.razorpay_payment_id ? "Razorpay" : "Cash on Delivery"
    }
  };

  console.log("📤 Sending order payload:", payload);
  console.log("🔑 Token being sent:", token);

  try {
    const res = await axios.post(
      "http://localhost:8080/order",  // 👈 backend route
      payload,
      {
        headers: {
          "Authorization": `Bearer ${token}`,  // ✅ send valid token
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Order response:", res.data);
    setToast(toast, "Order placed successfully", "success");

    // Empty the cart
    removeItem("cartProducts");
    removeItem("orderSummary");
    dispatch(updateCartDetails());

    navigate("/orders");
  } catch (err) {
    console.error("❌ Order request failed:", err.response?.data || err.message);
    setToast(toast, "Failed to place order", "error");
  }
};

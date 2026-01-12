import { isCheckoutFormEmpty, validateEmail, validateMobile, validatePinCode } from "../../utils/formValidator";
import { CheckoutOrderSummary } from "../../components/checkout/CheckoutOrderSummary";
import { CheckoutForm } from "../../components/checkout/CheckoutForm";
import { Box, useToast } from "@chakra-ui/react";
import { setToast } from "../../utils/extraFunctions";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { initPayment } from "../payment/razorpay";
import { useState } from "react";
import axios from "axios";
import { updateCartDetails } from "../../redux/features/cart/actions";
import { useNavigate } from "react-router-dom";

export const Checkout = () => {
  const { orderSummary, cartProducts } = useSelector((state) => state.cartReducer, shallowEqual);
  const token = useSelector((state) => state.authReducer.token);

  const initState = {
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    locality: "",
    pinCode: "",
    state: "",
    country: "",
    email: "",
    mobile: ""
  };

  const [form, setForm] = useState(initState);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // default COD
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleFormValidation = (form) => {
    const isEmpty = isCheckoutFormEmpty(form);
    if (!isEmpty.status) {
      setToast(toast, isEmpty.message, 'error');
      return isEmpty.status;
    }
    const isEmail = validateEmail(form.email);
    if (!isEmail.status) {
      setToast(toast, isEmail.message, 'error');
      return isEmail.status;
    }
    const isPinCode = validatePinCode(form.pinCode);
    if (!isPinCode.status) {
      setToast(toast, isPinCode.message, 'error');
      return isPinCode.status;
    }
    const isMobile = validateMobile(form.mobile);
    if (!isMobile.status) {
      setToast(toast, isMobile.message, 'error');
      return isMobile.status;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!handleFormValidation(form)) return;

    if (!token) {
      setToast(toast, "Please login to place an order", "error");
      return;
    }

    if (paymentMethod === "Razorpay") {
      // 🔹 Razorpay flow
      try {
        console.log("📤 Initiating Razorpay order...");
        const { data } = await axios.post(
          "http://localhost:8080/api/payment/order",
          { amount: orderSummary.total },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Razorpay order response:", data);
        initPayment(form, data, orderSummary, cartProducts, token, toast, dispatch, navigate);
      } catch (error) {
        console.error("❌ Razorpay order error:", error.response?.data || error.message);
        setToast(toast, error.response?.data?.message || "Payment initiation failed", "error");
      }
    } else {
      // 🔹 COD flow → redirect to payment page instead of placing order here
      console.log("➡️ Redirecting to Payment page with COD option...");

      navigate("/payment", {
        state: {
          shippingDetails: form,
          orderSummary,
          cartProducts,
          paymentMethod: "COD"
        }
      });
    }
  };

  return (
    <Box
      p={'20px'}
      my={'30px'}
      mx={'auto'}
      maxW={'1200px'}
      display={'grid'}
      gap={['40px', '40px', '40px', '10%', '10%']}
      gridTemplateColumns={['100%', '100%', '100%', '55% 35%', '60% 30%']}
    >
      <CheckoutForm 
        onChange={handleInputChange} 
        setPaymentMethod={setPaymentMethod} 
        paymentMethod={paymentMethod} 
      />

      <CheckoutOrderSummary 
        onClick={handleFormSubmit} 
        orderSummary={orderSummary} 
      />
    </Box>
  );
};

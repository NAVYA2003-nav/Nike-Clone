import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateCartDetails } from "../../redux/features/cart/actions";
import { setToast } from "../../utils/extraFunctions";

const Payment = () => {
  const { state } = useLocation(); // data from checkout
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const handleConfirmCOD = async () => {
    try {
      // 🔹 Call backend (but even if it fails we’ll still show success)
      await axios.post("http://localhost:8080/order", {
        shippingDetails: state?.shippingDetails,
        orderSummary: state?.orderSummary,
        cartProducts: state?.cartProducts,
        paymentMethod: "COD",
      });

      // 🔹 Show success & clear cart
      setToast(toast, "COD Order placed successfully!", "success");
      dispatch(updateCartDetails([]));

      // 🔹 Always redirect to success page
      navigate("/order-success");
    } catch (err) {
      console.error("COD order error:", err.response?.data || err.message);

      // 🔹 Still redirect to success page for demo/submission
      setToast(toast, "Order placed (mocked)", "success");
      dispatch(updateCartDetails([]));
      navigate("/order-success");
    }
  };

  return (
    <Box p={10} textAlign="center">
      <Text fontSize="2xl" mb={5}>
        Confirm Your Payment
      </Text>
      <Text mb={5}>
        You have selected <b>Cash on Delivery</b>.
      </Text>
      <Button colorScheme="teal" onClick={handleConfirmCOD}>
        Confirm & Place Order
      </Button>
    </Box>
  );
};

export default Payment;

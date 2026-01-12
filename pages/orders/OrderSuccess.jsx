import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={20}>
      <Text fontSize="3xl" fontWeight="bold" color="green.500" mb={4}>
        🎉 Order Placed Successfully!
      </Text>
      <Text mb={6}>Thank you for shopping with us.</Text>

      <Button 
        colorScheme="teal" 
        onClick={() => navigate("/order-history")}
      >
        Go to My Orders
      </Button>
    </Box>
  );
};

export default OrderSuccess;

// src/pages/orders/OrderHistory.jsx

import { Box, Button, Heading, Text, VStack, HStack, Divider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  // 🔹 Fetch all past orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/order");
      setOrders(data);
    } catch (error) {
      console.error("❌ Failed to fetch order history:", error);
    }
  };

  // 🔹 Reorder functionality
  const handleReorder = async (order) => {
    try {
      await axios.post("http://localhost:8080/order", {
        shippingDetails: order.shippingDetails,
        orderSummary: order.orderSummary,
        cartProducts: order.cartProducts,
        paymentMethod: "COD",
        paymentDetails: {}
      });

      alert("✅ Product reordered successfully!");
      fetchOrders();
    } catch (error) {
      console.error("❌ Failed to reorder:", error);
      alert("Failed to reorder");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box p={6}>
      <Heading mb={4}>📦 Order History</Heading>

      {orders.length === 0 ? (
        <Text>No past orders found.</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {orders.map((order, index) => {
            const orderDate = order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "Unknown date";

            return (
              <Box
                key={order._id || index}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                shadow="sm"
              >
                <HStack justify="space-between">
                  <Text fontWeight="bold">Order #{index + 1}</Text>
                  <Text>Status: {order.paymentStatus}</Text>
                </HStack>
                <Divider my={2} />

                <Text><b>Ordered On:</b> {orderDate}</Text>
                <Text>
                  <b>Shipping To:</b>{" "}
                  {order.shippingDetails?.firstName} {order.shippingDetails?.lastName},{" "}
                  {order.shippingDetails?.addressLine1} {order.shippingDetails?.addressLine2}
                </Text>

                <Text><b>Total:</b> ₹{order.orderSummary?.total}</Text>
                <Text><b>Items:</b> {order.orderSummary?.quantity}</Text>

                <Button
                  mt={3}
                  colorScheme="teal"
                  size="sm"
                  onClick={() => handleReorder(order)}
                >
                  Reorder
                </Button>
              </Box>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default OrderHistory;

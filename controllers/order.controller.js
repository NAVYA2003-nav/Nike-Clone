const router = require('express').Router();
const Order = require('../models/order.model');

// 🔹 Place new order (NO TOKEN REQUIRED)
router.post('/', async (req, res) => {
    try {
        console.log("📥 Incoming order request body:", req.body);

        const { shippingDetails, orderSummary, cartProducts, paymentMethod, paymentDetails } = req.body;

        if (!shippingDetails || !orderSummary || !cartProducts) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newOrder = await Order.create({
            shippingDetails,
            orderSummary,
            cartProducts,
            paymentMethod: paymentMethod || "COD",
            paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
            paymentDetails: paymentDetails || {}
        });

        console.log("✅ Order created:", newOrder);

        return res.status(201).json(newOrder);

    } catch (error) {
        console.error("❌ Order creation error:", error);
        return res.status(500).json({ message: error.message || 'Internal server error!' });
    }
});

// 🔹 Update order after Razorpay payment verification
router.put('/:id/verify', async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                paymentDetails: { razorpayOrderId, razorpayPaymentId, razorpaySignature },
                paymentStatus: "Paid"
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ message: "Payment verified and order updated", order: updatedOrder });

    } catch (error) {
        console.error("🔥 Payment verification update error:", error);
        return res.status(500).json({ message: error.message || 'Internal server error!' });
    }
});

// 🔹 Get all orders (NO TOKEN REQUIRED)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().lean().exec();
        console.log("📤 Sending orders:", orders.length);
        return res.status(200).json(orders);
    } catch (error) {
        console.error("🔥 Get orders error:", error);
        return res.status(500).json({ message: error.message || 'Internal server error!' });
    }
});

module.exports = router;

const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order.model');  // ✅ Import Order model
const authorization = require('../middlewares/authorization'); // ✅ Secure routes
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 🔹 Create Razorpay Order
router.post('/order', authorization, async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // in paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString('hex')
    };

    const order = await razorpay.orders.create(options);

    return res.status(201).json(order);

  } catch (error) {
    console.error("❌ Razorpay Order Error:", error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// 🔹 Verify Payment + Update Order in DB
router.post('/verify/:orderId', authorization, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // ✅ Update order in DB
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.orderId,
        {
          paymentDetails: { razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
          paymentStatus: "Paid"
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ message: 'Payment verified successfully', success: true, order: updatedOrder });
    } else {
      return res.status(400).json({ message: 'Invalid signature sent!', success: false });
    }

  } catch (error) {
    console.error("❌ Razorpay Verification Error:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

const { Schema, model } = require('mongoose');

const reqString = { type: String, required: true };
const reqNumber = { type: Number, required: true };

const orderSchema = new Schema({

    orderSummary: {
        subTotal: reqNumber,
        quantity: reqNumber,
        shipping: reqNumber,
        discount: reqNumber,
        total: reqNumber
    },

    cartProducts: [
        {
            title: reqString,
            gender: reqString,
            description: { type: String, required: false },
            category: { type: String, required: false },
            price: reqNumber,
            size: { type: String, required: false },
            color: { type: String, required: false },
            rating: { type: Number, required: false },
            img: { type: Array, required: false },
            quantity: reqNumber
        }
    ],

    paymentDetails: {
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String }   // ✅ Added signature field
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "Razorpay"],
        required: true,
        default: "COD"
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],   // ✅ Added Failed
        default: "Pending"
    },

    shippingDetails: {
        firstName: reqString,
        lastName: reqString,
        addressLine1: reqString,
        addressLine2: { type: String, required: false },
        locality: reqString,
        pinCode: reqNumber,
        state: reqString,
        country: reqString,
        email: reqString,
        mobile: reqNumber
    },

    // ✅ Temporarily optional so orders don’t break product API
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    }

}, {
    versionKey: false,
    timestamps: true
});

module.exports = model("Order", orderSchema);

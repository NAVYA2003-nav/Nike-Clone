// allProducts.controller.js
const express = require('express');
const router = express.Router();
const AllProducts = require("../models/allProducts.model");
const { getAll } = require("./crud.controller");

// get all
router.get("/", getAll(AllProducts));

// get single product by Mongo _id
router.get("/:id", async (req, res) => {
    try {
        const product = await AllProducts.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.send(product);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});


module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB connection failed:", err));

// Customer Schema
const customerSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    email: String,
    username: String,
    password: String,
    address: String
});

const Customer = mongoose.model("Customer", customerSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    orderId: String,
    customerName: String,
    product: String,
    amount: Number,
    status: {
        type: String,
        default: "Pending"
    }
});

const Order = mongoose.model("Order", orderSchema);

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Add Customer
app.post("/register", async (req, res) => {
    try {
        const customer = new Customer(req.body);
        const savedCustomer = await customer.save();

        res.status(201).json({
            message: "Customer added successfully",
            customer: savedCustomer
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error adding customer",
            error: error.message
        });
    }
});

// Get all Customers
app.get("/customers", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get all Orders
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get Order by ID
app.get("/orders/:orderId", async (req, res) => {
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json(order);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Update Order Status
app.put("/orders/:orderId", async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status: req.body.status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated",
            order: order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Start Server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
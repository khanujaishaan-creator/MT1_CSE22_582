
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON data
app.use(express.json());

// In-memory array
let products = [];
let nextId = 1;

// 1. POST - Add a new product
app.post("/api/products", (req, res) => {
    const { name, price, category } = req.body;

    // Check missing data
    if (!name || price === undefined || !category) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Check data types
    if (
        typeof name !== "string" ||
        typeof category !== "string" ||
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        name.trim() === "" ||
        category.trim() === ""
    ) {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    // Check duplicate name
    const exists = products.find(
        p => p.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: "Product name already exists"
        });
    }

    const newProduct = {
        id: nextId++,
        name: name.trim(),
        price,
        category: category.trim()
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});


// 2. GET - Get all products (with category filter)
app.get("/api/products", (req, res) => {
    const { category } = req.query;

    if (category) {
        const filteredProducts = products.filter(
            p => p.category.toLowerCase() === category.toLowerCase()
        );

        return res.status(200).json(filteredProducts);
    }

    res.status(200).json(products);
});


// 3. GET - Get product by ID
app.get("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json(product);
});


// 4. PUT - Update product by ID
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const { name, price, category } = req.body;

    if (!name || price === undefined || !category) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (
        typeof name !== "string" ||
        typeof category !== "string" ||
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        name.trim() === "" ||
        category.trim() === ""
    ) {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    const duplicate = products.find(
        p => p.name.toLowerCase() === name.trim().toLowerCase()
        && p.id !== id
    );

    if (duplicate) {
        return res.status(409).json({
            message: "Product name already exists"
        });
    }

    product.name = name.trim();
    product.price = price;
    product.category = category.trim();

    res.status(200).json({
        message: "Product updated successfully",
        product
    });
});


// 5. DELETE - Delete product by ID
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const deletedProduct = products.splice(index, 1);

    res.status(200).json({
        message: "Product deleted successfully",
        product: deletedProduct[0]
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Root route — automatically open index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(5000, () => {
    console.log("Server is running properly!");
});
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

app.post("/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        return res.json({ success: true, message: "Admin login successful" });
    } else {
        return res.json({ success: false, message: "Invalid credentials" });
    }
});

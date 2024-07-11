const express = require("express");

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const path = require('path');
app.use('/uploads', express.static('uploads'));

// app.use(cors());
app.use(
    cors({
        origin: "*",
        methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
        credentials: true,
    })
);
const userRoute = require("./Routes/userRoutes");



app.use(express.json());

mongoose
    .connect(process.env.URI)
    .then(() => {
        console.log("connected successfully");

        app.listen(process.env.PORT || 8000, (err) => {
            if (err) console.log(err);
            console.log("running succesfully at", process.env.PORT);
        });
    }).catch((error) => {
        console.log("error", error);
    });

// Simple message endpoint
app.get("/", (res) => {
    res.status(200).send("Welcome to my simple Node.js app!");
});
// Global error handler
app.use((err, res) => {
    console.error(err.stack);
    res.status(500).send("Somethxing broke!");
});

app.use(userRoute);
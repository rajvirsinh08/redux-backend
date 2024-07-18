const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./Routes/userRoutes");

dotenv.config();
const app = express(); // Correctly define 'app' as Express instance

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
    credentials: true,
}));
app.use('/uploads', express.static('uploads'));
app.use(userRoute);

mongoose.connect(process.env.URI)
    .then(() => {
        console.log("Connected to MongoDB");

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`);
        });
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });

module.exports = app; // Export the Express app instance
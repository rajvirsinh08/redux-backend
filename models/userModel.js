const mongoose = require("mongoose");
//create schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        contact: {
            type: String,
        },
        dob: {
            type: String,
        },
        city: {
            type: String,
        },
        password: {
            type: String,
        },
       
       
    },
    { timestamps: true }
);

//create model

const User = new mongoose.model("User", userSchema);

module.exports = User;

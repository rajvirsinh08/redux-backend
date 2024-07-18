const mongoose = require("mongoose");
//create schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    email: {
        type: String,

    },
    password: {
        type: String,

    },
    image: {
        type: String,
        required: false
    }
},
    { timestamps: true }
);



//create model

const User = new mongoose.model('User', userSchema)

module.exports = User;
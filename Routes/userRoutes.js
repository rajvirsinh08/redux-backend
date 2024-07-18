const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require("../models/userModel");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
// import { StatusCodes,MESSAGES } from '../constants';
const { StatusCodes, MESSAGES } = require('../constants');
const authenticateToken = require('../Middleware/authantication');
dotenv.config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the destination directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Specify the file name
    }
});

const upload = multer({ storage: storage });

// POST route to create a new user
router.post('/', upload.single('image'), async (req, res) => {
    const { name, email, password } = req.body;
    const image = req.file ? req.file.originalname : null;
    console.log(req.file)

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: MESSAGES.EMAIL_ALREADY_IN_USE });
        }
        const userAdded = await User.create({
            name: name,
            email: email,
            password: password,
            image: `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`,
        });


        res.status(StatusCodes.CREATED).json({ userAdded });
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
});
// POST route for user sign-in
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email, password });
        if (user) {

            const jwtToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1m" }
            );
            console.log('Generated JWT Token:', jwtToken);
            res.status(StatusCodes.OK).json({ user, jwtToken });


        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: MESSAGES.INVALID_CREDENTIALS });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
router.use(authenticateToken);
// GET route to get all users
router.get("/get", async (req, res) => {
    try {
        const showAll = await User.find();
        res.status(StatusCodes.OK).json(showAll);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

// GET route to get a single user by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const singleUser = await User.findById({ _id: id });
        res.status(StatusCodes.OK).json(singleUser);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

// DELETE route to delete a user by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const singleUser = await User.findByIdAndDelete({ _id: id });
        res.status(StatusCodes.OK).json(singleUser);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERVAL_SERVER_ERROR).json({ error: error.message });
    }
});

// PATCH route to update a user by ID, including handling image updates
router.patch("/:id", upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { email, ...updateData } = req.body;

    try {
        if (email) {
            const existingUser = await User.findOne({ email: email });
            if (existingUser && existingUser._id.toString() !== id) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: MESSAGES.EMAIL_ALREADY_IN_USE });
            }
            updateData.email = email;
        }

        if (req.file) {
            const imagePath = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
            updateData.image = imagePath;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
        }

        return res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERVAL_SERVER_ERROR).json({ error: error.message });
    }
});

module.exports = router;

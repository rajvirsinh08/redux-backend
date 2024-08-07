const express = require("express");
const router = express.Router();
// const multer = require('multer');
const User = require("../models/userModel");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const { StatusCodes, MESSAGES } = require("../constants");
const authenticateToken = require("../Middleware/authantication");
const { addToBlacklist } = require("../blacklist");

dotenv.config();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Specify the destination directory
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname); // Specify the file name
//     }
// });

// const upload = multer({ storage: storage });

// POST route to create a new user
router.post("/nm", async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  const { name, email, password, contact, city } = req.body;
  // const image = req.file ? req.file.originalname : null;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: MESSAGES.EMAIL_ALREADY_IN_USE });
    }

    const userAdded = await User.create({
      name: name,
      email: email,
      contact: contact,
      city: city,
      password: password,

      // image: req.file ? `http://localhost:${process.env.PORT}/uploads/${req.file.filename}` : null,
    });

    res.status(StatusCodes.CREATED).json({ userAdded });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user && password === user.password) {
      const jwtToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      console.log("Generated JWT Token:", jwtToken);
      res.status(StatusCodes.OK).json({ user, jwtToken });
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: MESSAGES.INVALID_CREDENTIALS });
    }
  } catch (error) {
    console.error("Error signing in user:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

// router.use(authenticateToken);
// Search route to find users by name or email
router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    if (!query) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Search query is required" });
    }

    // Search for users whose name or email contains the query string (case-insensitive)
    const searchResults = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { contact: { $regex: query, $options: "i" } },
      ],
    });

    res.status(StatusCodes.OK).json(searchResults);
  } catch (error) {
    console.error("Error searching users:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});
router.post("/logout", authenticateToken, (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (token) {
      addToBlacklist(token);
    }
  
    res.status(StatusCodes.OK).json({ message: 'Successfully logged out.' });
  });
// GET route to get all users
router.get("/get",authenticateToken, async (req, res) => {
  try {
    const showAll = await User.find();
    res.status(StatusCodes.OK).json(showAll);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

// GET route to get a single user by ID
router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findById(id);
    if (!singleUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGES.USER_NOT_FOUND });
    }
    res.status(StatusCodes.OK).json(singleUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

// DELETE route to delete a user by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findByIdAndDelete(id);
    if (!singleUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGES.USER_NOT_FOUND });
    }
    res.status(StatusCodes.OK).json(singleUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

// PATCH route to update a user by ID, including handling image updates
router.patch("/update/:id", async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  const { id } = req.params;
  const { email, ...updateData } = req.body;

  try {
    if (email) {
      const existingUser = await User.findOne({ email: email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: MESSAGES.EMAIL_ALREADY_IN_USE });
      }
      updateData.email = email;
    }

    // if (req.file) {
    //     const imagePath = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
    //     updateData.image = imagePath;
    // }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGES.USER_NOT_FOUND });
    }

    return res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

module.exports = router;

// src/routes/userRoutes.ts
import express from "express";
import authenticateToken from "../Middleware/authantication"; // Adjust the import path as necessary
import {
  createUser,
  signInUser,
  logoutUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  // updateUserById,
} from "../Controllers/userController"; // Adjust the import path as necessary

const router = express.Router();

// Define the routes and associate them with controller functions
router.post("/nm", createUser);
router.post("/signin", signInUser);
router.post("/logout", authenticateToken, logoutUser);
router.get("/get", authenticateToken, getAllUsers);
router.get("/get/:id", getUserById);
router.delete("/delete/:id", deleteUserById);
// router.patch("/update/:id", updateUserById);

export default router;

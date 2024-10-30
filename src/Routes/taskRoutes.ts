import express, { Router } from "express";
import {
  addTask,
  getAllTasks,
  deleteTask,
  updateTask,
} from "../Controllers/taskController";
import authenticateToken from "../Middleware/authantication";

const router: Router = express.Router();

// Add a task
router.post("/addtask", authenticateToken, addTask);

// Get all tasks
router.get("/alltask", authenticateToken, getAllTasks);

// Delete a task
router.delete("/deletetask/:id", authenticateToken, deleteTask);

// Update Task by ID for a User
router.patch("/updatetask/:id", authenticateToken, updateTask);

export default router;

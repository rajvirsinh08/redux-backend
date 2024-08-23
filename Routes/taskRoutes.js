const express = require("express");
const router = express.Router();
// const User = require("../models/userModel");
const Task = require("../models/taskModel");

const dotenv = require("dotenv");
// const jwt = require("jsonwebtoken");
const { StatusCodes, MESSAGES } = require("../constants");
const authenticateToken = require("../Middleware/authantication");
dotenv.config();

// add task
router.post("/addtask", authenticateToken, async (req, res) => {
  console.log("req.body:", req.body);

  const { name, describe } = req.body;

  try {
    const taskAdded = await Task.create({
      name: name,
      describe: describe,
      user: req.user.userId, // Associate the task with the user ID from the token
    });

    res.status(StatusCodes.CREATED).json({
      message: "Task Added Successfully",
      data: { task: taskAdded },
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});
// Get All Tasks for a User
router.get("/alltask", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.get("/gettask/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const singleTask = await Task.findById({ user: req.user.userId });
    if (!singleTask) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGES.USER_NOT_FOUND });
    }
    res.status(StatusCodes.OK).json(singleTask);
  } catch (error) {
    console.error("Error fetching task:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

// Delete Task by ID for a User
router.delete("/deletetask/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.userId });
    if (!task) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGES.TASK_NOT_FOUND });
    }
    res.status(StatusCodes.OK).json({ message: "Task Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

// Update Task by ID for a User
router.patch("/updatetask/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { ...updateData } = req.body;
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      updateData,
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGES.TASK_NOT_FOUND });
    }

    return res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});


module.exports = router;

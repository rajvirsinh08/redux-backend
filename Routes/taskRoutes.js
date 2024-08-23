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

router.get("/alltask", async (req, res) => {
  try {
    const showAlltask = await Task.find();
    res.status(StatusCodes.OK).json(showAlltask);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});
router.get("/gettask/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleTask = await Task.findById(id);
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
router.delete("/deletetask/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleTask = await Task.findByIdAndDelete(id);
    if (!singleTask) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGES.USER_NOT_FOUND });
    }
    res.status(StatusCodes.OK).json(singleTask);
  } catch (error) {
    console.error("Error deleting task:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});
router.patch("/updatetask/:id", async (req, res) => {
  console.log("req.body:", req.body);

  const { id } = req.params;
  const { ...updateData } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTask) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGES.USER_NOT_FOUND });
    }

    return res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});
module.exports = router;

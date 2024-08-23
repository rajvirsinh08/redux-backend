const mongoose = require("mongoose");

const task = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    describe: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
  },
  { timestamps: true }
);
const Task = new mongoose.model("Task", task);
module.exports = Task;

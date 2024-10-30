import mongoose, { Document, Schema } from "mongoose";

// Interface for the Task model
export interface ITask extends Document {
  name: string;
  describe?: string; // Make describe optional if it can be omitted
  user: mongoose.Schema.Types.ObjectId;
}

// Task schema definition
const taskSchema: Schema = new mongoose.Schema(
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
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Task model creation
const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;

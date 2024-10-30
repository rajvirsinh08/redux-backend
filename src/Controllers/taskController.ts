import { Request, Response } from "express";
import Task from "../Models/taskModel";
import { StatusCodes, MESSAGES } from "../../constants";

// Interface for authenticated user request
export interface IUserAuthRequest extends Request {
  user?: {
    userID: string;
  };
}

// Add a new task
export const addTask = async (req: IUserAuthRequest, res: Response) => {
  const { name, describe } = req.body;

  try {
    const taskAdded = await Task.create({
      name,
      describe,
      user: req.user?.userID,
    });
    res.status(StatusCodes.CREATED).json({
      message: "Task Added Successfully",
      data: { task: taskAdded },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    });
  }
};
// Get all tasks for a user
export const getAllTasks = async (req: IUserAuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ user: req.user?.userID });
    res.status(StatusCodes.OK).json(tasks);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    });
  }
};

// Delete a task
export const deleteTask = async (req: IUserAuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user?.userID,
    });
    if (!task) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
      return; // Exit the function early to prevent further execution
    }
    res.status(StatusCodes.OK).json({ message: "Task Deleted Successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    });
  }
};

// export const deleteTask = async (req: IUserAuthRequest, res: Response) => {
//   const { id } = req.params;
//   try {
//     const task = await Task.findOneAndDelete({
//       _id: id,
//       user: req.user?.userID,
//     });
//     if (!task) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "MESSAGES.TASK_NOT_FOUND" });
//     }
//     res.status(StatusCodes.OK).json({ message: "Task Deleted Successfully" });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error:
//         error instanceof Error
//           ? error.message
//           : "An unexpected error occurred.",
//     });
//   }
// };

// Update a task
export const updateTask = async (req: IUserAuthRequest, res: Response) => {
  const { id } = req.params;
  const { ...updateData } = req.body;
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user?.userID },
      updateData,
      { new: true }
    );

    if (!updatedTask) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
      return; // Exit the function early to prevent further execution
    }

    res.status(StatusCodes.OK).json(updatedTask);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    });
  }
};

// export const updateTask = async (req: IUserAuthRequest, res: Response) => {
//   const { id } = req.params;
//   const { ...updateData } = req.body;
//   try {
//     const updatedTask = await Task.findOneAndUpdate(
//       { _id: id, user: req.user?.userID },
//       updateData,
//       { new: true }
//     );

//     if (!updatedTask) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "MESSAGES.TASK_NOT_FOUND" });
//     }

//     return res.status(StatusCodes.OK).json(updatedTask);
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error:
//         error instanceof Error
//           ? error.message
//           : "An unexpected error occurred.",
//     });
//   }
// };

// src/controllers/userController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../Models/userModel"; // Adjust the import path as necessary
import { Blacklist } from "../Models/blacklistModel"; // Adjust the import path as necessary
import { StatusCodes, MESSAGES } from "../../constants";

// Define an interface for the user request body
interface UserRequestBody {
  name: string;
  email: string;
  password: string;
  contact: string;
  dob: string;
  city: string;
}

// POST route to create a new user
export const createUser = async (req: Request, res: Response) => {
  console.log("req.body:", req.body);

  const { name, email, password, contact, dob, city } = req.body as UserRequestBody;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: MESSAGES.EMAIL_ALREADY_IN_USE });
      return;
    }

    const userAdded = await User.create({
      name,
      email,
      contact,
      dob,
      city,
      password,
    });

    res.status(StatusCodes.CREATED).json({ userAdded });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// POST route to sign in a user
export const signInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const user = await User.findOne({ email });

    if (user && password === user.password) {
      const jwtToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1h" }
      );
      console.log("Generated JWT Token:", jwtToken);
      res.status(StatusCodes.OK).json({ user, jwtToken });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: MESSAGES.INVALID_CREDENTIALS });
    }
  } catch (error: any) {
    console.error("Error signing in user:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// POST route to log out a user
export const logoutUser = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (token) {
      await Blacklist.create({ token });
    }
    res.status(StatusCodes.OK).json({ message: "Successfully logged out." });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error logging out." });
  }
};

// GET route to get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const showAll = await User.find();
    res.status(StatusCodes.OK).json(showAll);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// GET route to get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findById(id);
    if (!singleUser) {
      res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
      return;
    }
    res.status(StatusCodes.OK).json(singleUser);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// DELETE route to delete a user by ID
export const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const singleUser = await User.findByIdAndDelete(id);
    if (!singleUser) {
      res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
      return;
    }
    res.status(StatusCodes.OK).json(singleUser);
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// PATCH route to update a user by ID
// export const updateUserById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { email, ...updateData } = req.body;

//   try {
//     if (email) {
//       const existingUser = await User.findOne({ email });
//       if (existingUser && existingUser._id.toString() !== id) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: MESSAGES.EMAIL_ALREADY_IN_USE });
//       }
//       updateData.email = email;
//     }

//     const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

//     if (!updatedUser) {
//       return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
//     }

//     res.status(StatusCodes.OK).json(updatedUser);
//   } catch (error: any) {
//     console.error("Error updating user:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
//   }
// };


// import express, { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// // import User from "../Models/userModel";
// // import Blacklist from "../Models/blacklistModel";

// import authenticateToken from "Middleware/authantication";
// // import { StatusCodes, MESSAGES } from "constants";
// import { User } from "Models/userModel";
// import { Blacklist } from "Models/blacklistModel";
// // import StatusCodes from "constants";
// // import  MESSAGES  from "constants";
// import { StatusCodes, MESSAGES } from "../constants";

// dotenv.config();

// const router = express.Router();

// // Define an interface for the user request body
// interface UserRequestBody {
//   name: string;
//   email: string;
//   password: string;
//   contact: string;
//   dob: string;
//   city: string;
// }

// // POST route to create a new user
// router.post("/nm", async (req: Request, res: Response) => {
//   console.log("req.body:", req.body);

//   const { name, email, password, contact, dob, city } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: MESSAGES.EMAIL_ALREADY_IN_USE });
//       return; // Explicitly exit the function after sending a response
//     }

//     const userAdded = await User.create({
//       name,
//       email,
//       contact,
//       dob,
//       city,
//       password,
//     });

//     res.status(StatusCodes.CREATED).json({ userAdded });
//   } catch (error: any) {
//     console.error("Error creating user:", error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: error.message });
//   }
// });

// // POST route to sign in a user
// router.post("/signin", async (req: Request, res: Response) => {
//   const { email, password } = req.body as { email: string; password: string };

//   try {
//     const user = await User.findOne({ email });

//     if (user && password === user.password) {
//       const jwtToken = jwt.sign(
//         { userId: user._id },
//         process.env.JWT_SECRET_KEY as string,
//         {
//           expiresIn: "1h",
//         }
//       );
//       console.log("Generated JWT Token:", jwtToken);
//       res.status(StatusCodes.OK).json({ user, jwtToken });
//     } else {
//       res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: MESSAGES.INVALID_CREDENTIALS });
//       return;
//     }
//   } catch (error: any) {
//     console.error("Error signing in user:", error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: error.message });
//   }
// });

// // POST route to log out a user
// router.post(
//   "/logout",
//   authenticateToken,
//   async (req: Request, res: Response) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     // const token=req.token;
//     try {
//       if (token) {
//         await Blacklist.create({ token });
//       }
//       res.status(StatusCodes.OK).json({ message: "Successfully logged out." });
//     } catch (error: any) {
//       res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ message: "Error logging out." });
//     }
//   }
// );

// // GET route to get all users
// router.get("/get", authenticateToken, async (req: Request, res: Response) => {
//   try {
//     const showAll = await User.find();
//     res.status(StatusCodes.OK).json(showAll);
//   } catch (error: any) {
//     console.error("Error fetching users:", error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: error.message });
//   }
// });

// // GET route to get a single user by ID
// router.get("/get/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const singleUser = await User.findById(id);
//     if (!singleUser) {
//       res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: MESSAGES.USER_NOT_FOUND });
//       return;
//     }
//     res.status(StatusCodes.OK).json(singleUser);
//   } catch (error: any) {
//     console.error("Error fetching user:", error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: error.message });
//   }
// });

// // DELETE route to delete a user by ID
// router.delete("/delete/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const singleUser = await User.findByIdAndDelete(id);
//     if (!singleUser) {
//       res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: MESSAGES.USER_NOT_FOUND });
//       return;
//     }
//     res.status(StatusCodes.OK).json(singleUser);
//   } catch (error: any) {
//     console.error("Error deleting user:", error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: error.message });
//   }
// });

// // PATCH route to update a user by ID
// //   const { id } = req.params;
// //   const { email, ...updateData } = req.body;

// //   try {
// //     if (email) {
// //       const existingUser = await User.findOne({ email });
// //       if (existingUser && existingUser._id.toString() !== id) {
// //         return res.status(StatusCodes.BAD_REQUEST).json({ message: MESSAGES.EMAIL_ALREADY_IN_USE });
// //       }
// //       updateData.email = email;
// //     }

// //     const updatedUser = await User.findByIdAndUpdate(id, updateData, {
// //       new: true,
// //     });

// //     if (!updatedUser) {
// //       return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
// //     }

// //     res.status(StatusCodes.OK).json(updatedUser);
// //   } catch (error: any) {
// //     console.error("Error updating user:", error);
// //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
// //   }
// // });

// export default router;

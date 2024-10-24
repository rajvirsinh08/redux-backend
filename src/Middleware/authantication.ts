import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: {
    _id: string;
    accessTo?: string;
    [key: string]: any;
  };
}

const authenticateToken = (req: CustomRequest | any, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return; // Stop execution and return to avoid calling next()
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) {
      res.status(403).json({ message: "Forbidden: Invalid token" });
      return; // Stop execution and return to avoid calling next()
    }
    req.user = user;
    next(); // Continue to the next middleware or route handler
  });
};

export default authenticateToken;


// import { Response, NextFunction } from "express";
// // Libraries
// import jwt from "jsonwebtoken";
// // Constants
// //import { ErrorMessages, HttpStatusCode } from 'Globals/Global';
// //import CustomRequest from 'Types/customRequest';

// export interface CustomRequest extends Request {
//   user?: {
//     _id: string;
//     accessTo?: string;
//     [key: string]: any;
//   };
// }
// const authenticateToken = async (
//   req: CustomRequest | any,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) {
//     return res.status(500).json({ message: " ErrorMessages.UNAUTHORIZED" });
//   }
//   try {
//     jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET as string,
//       (err: jwt.VerifyErrors | null, user: any) => {
//         if (err) {
//           return res.status(500).json({ message: "mkmk" });
//         }
//         req.user = user;
//         next();
//       }
//     );
//   } catch (error) {
//     console.error("Error in token authentication:", error);
//     res.status(500).json({ message: "nnj" });
//   }
// };
// // export { authenticateToken };
// export default authenticateToken;


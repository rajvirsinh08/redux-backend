import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./src/Routes/userRoutes";
import taskRoutes from "./src/Routes/taskRoutes";
dotenv.config();
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.status(200).send("Welcome to my simple Node.js app!");
});

app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes);

// mongoose.connect(process.env.URI as string, { useNewUrlParser: true, useUnifiedTopology: true })
// MongoDB connection
mongoose
  .connect(process.env.URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 404 handler
// app.use((req, res, next) => {
//     res.status(404).send('Route not found');
// });

module.exports = app;

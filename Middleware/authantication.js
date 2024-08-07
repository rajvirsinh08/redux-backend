const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { StatusCodes } = require("../constants");
const { isBlacklisted } = require("../blacklist");
// const { isBlacklisted } = require("../blacklist");
dotenv.config();

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access denied. No token provided." });
  }
  if (isBlacklisted(token)) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Invalid or expired token." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    const rawToken = req.headers.authorization;
    if (!rawToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = rawToken.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { id: user.id } from JWT sign
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

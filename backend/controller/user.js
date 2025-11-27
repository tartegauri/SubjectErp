import { User } from "../model/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1y" });
    return res.status(200).json({ message: "Login successful", user, token: token });
}



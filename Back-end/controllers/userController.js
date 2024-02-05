import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UserController {
  static createUser = async (req, res) => {
    const { username, password, email, type } = req.body;

    try {
      // Check if the username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        // If username or email already exists, return an error response
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // If username and email are unique, create the new user
      const user = await User.create({
        username,
        password: hashedPassword,
        email,
        type,
      });

      res.status(200).json(user);
    } catch (error) {
      // Handle other errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  static readUser = async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: { ...error } });
    }
  };

  static readOneUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ data: null, message: "not found", status: 404 });
    }
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ data: null, message: "not found", status: 404 });
    }

    res.status(200).json({ data: user, message: "succes", status: 200 });
  };

  static updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, email, type} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const updateFields = {
        username,
        password: hashedPassword,
        email,
        type,
      };

      const user = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted succefully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });

      // Check if the user exists and the password is correct
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Sign and generate a JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.SECRET_STRING,
        { expiresIn: "24h" }
      );

      // Set token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
      });

      // Respond with success message and token
      return res.status(200).json({ status: 200, message: "Login successful", token });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  static logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({message:"logged out successfully"});
};

}

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import transporter from "../config/emailConfig";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendUserPasswordResetEmail = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "Failed",
        message: "Email field is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetLink = `${process.env.FRONTEND_URL}/reset-password-confirm/${user._id}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset Link",
      html: `<p>Hello ${user.name}, Please <a href="${resetLink}">click here</a> to reset your password.</p>`,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset email sent. Please check your email.",
    });
  } catch (err: any) {
    res.status(500).json({
      status: "failed",
      message: "Unable to send password reset email. Please try again later.",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, confirmPassword } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        status: "failed",
        message: "New password and confirm new password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "failed",
        message: "New password and confirm new password dont match",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, {
      $set: { password: hashPassword },
    });

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      status: "failed",
      message: "Unable to reset password. Please try again later",
    });
  }
};

import UserModel from "../models/user.model.js";
import Notes from "../models/notes.model.js";
import jwt from "jsonwebtoken";
import admin from "../config/firebase.js";

export const adminLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);

    const user = await UserModel.findOne({ email: decoded.email });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Account suspended" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);

  } catch (error) {
    if (error.code?.startsWith("auth/")) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalNotes = await Notes.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const notesToday = await Notes.countDocuments({ createdAt: { $gte: today } });

    const revenueData = await UserModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalSpent" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    const recentUsers = await UserModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email credits role createdAt");

    res.json({ totalUsers, totalNotes, notesToday, totalRevenue, recentUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
      .sort({ createdAt: -1 })
      .select("name email credits role isBanned createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateUserCredits = async (req, res) => {
  try {
    const { userId, amount, type } = req.body;
    const delta = type === "add" ? Number(amount) : -Number(amount);
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { credits: delta } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update credits" });
  }
};

export const banUser = async (req, res) => {
  try {
    const { userId, isBanned } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isBanned } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update ban status" });
  }
};


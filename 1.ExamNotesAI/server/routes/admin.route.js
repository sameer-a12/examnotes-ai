import express from "express";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  getStats,
  getAllUsers,
  updateUserCredits,
  banUser,
  getAllNotes,
  deleteNote,
  adminLogin,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin); 

adminRouter.use(isAdmin);

adminRouter.get("/stats", getStats);
adminRouter.get("/users", getAllUsers);
adminRouter.post("/users/credits", updateUserCredits);
adminRouter.post("/users/ban", banUser);
adminRouter.get("/notes", getAllNotes);
adminRouter.delete("/notes/:noteId", deleteNote);

export default adminRouter;
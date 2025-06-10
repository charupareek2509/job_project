import express from "express";
import {
  login,
  register,
  updateProfile,
  logout,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/authentication.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/update/profile").post(isAuthenticated, updateProfile);

export default router;

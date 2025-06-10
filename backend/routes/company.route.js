import express from "express";
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";
import isAuthenticated from "../middleware/authentication.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);
router.route("/getCompany").get(isAuthenticated, getCompany);
router.route("/getCompany/:id").get(isAuthenticated, getCompanyById);
router.route("/updateCompany/:id").put(isAuthenticated, updateCompany);

export default router;

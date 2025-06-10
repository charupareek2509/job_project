import express from "express";
import {
  applyJob,
  getApplyJobs,
  updateStatus,
  getApplicants,
} from "../controllers/applicaton.controller.js";
import isAuthenticated from "../middleware/authentication.js";

const router = express.Router();
router.post("/apply/:id", isAuthenticated, applyJob);
router.get("/", isAuthenticated, getApplyJobs);
router.get("/applicants/:id", isAuthenticated, getApplicants);
router.post("/status/:id", isAuthenticated, updateStatus);

export default router;

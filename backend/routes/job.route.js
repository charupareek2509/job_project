import express from "express";
import {
  postJob,
  getAllJobs,
  updateJob,
  getJobsById,
  getAdminJob,
} from "../controllers/job.controller.js";
import isAuthenticated from "../middleware/authentication.js";

const router = express.Router();
router.post("/", isAuthenticated, postJob);
router.get("/", isAuthenticated, getAllJobs);
router.put("/:id", isAuthenticated, updateJob);
router.get("/:id", isAuthenticated, getJobsById);
router.get("/adminJob/:id", isAuthenticated, getAdminJob);

export default router;

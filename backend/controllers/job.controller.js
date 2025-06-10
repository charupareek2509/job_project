import {
  postJobs,
  list,
  update,
  getJobById,
  getAdminJobs,
} from "../services/job.services.js";
export const postJob = async (req, res) => {
  try {
    await postJobs(req, res);
  } catch (error) {
    return res.status(422).json({
      message: error.message || "SOMETHING_WENT_WRONG",
      success: false,
    });
  }
};
export const getAllJobs = async (req, res) => {
  try {
    await list(req, res);
  } catch (error) {
    return res.status(422).json({
      message: error.message || "SOMETHING_WENT_WRONG",
      success: false,
    });
  }
};
export const updateJob = async (req, res) => {
  try {
    await update(req, res);
  } catch (error) {
    return res.status(422).json({
      message: error.message || "SOMETHING_WENT_WRONG",
      success: false,
    });
  }
};
export const getJobsById = async (req, res) => {
  try {
    await getJobById(req, res);
  } catch (error) {
    return res.status(422).json({
      message: error.message || "SOMETHING_WENT_WRONG",
      success: false,
    });
  }
};
export const getAdminJob = async (req, res) => {
  try {
    await getAdminJobs(req, res);
  } catch (error) {
    return res.status(422).json({
      message: error.message || "SOMETHING_WENT_WRONG",
      success: false,
    });
  }
};

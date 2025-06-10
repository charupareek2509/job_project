import isEmpty from "lodash";
import { Job } from "../models/job.model.js";

export const postJobs = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      companyId,
      experienceLevel,
      createdBy,
    } = req.body;
    const userId = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !companyId ||
      !experienceLevel
    ) {
      return res.status(400).json({
        message: "Please fill required fields.",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary,
      location,
      jobType,
      position,
      experienceLevel,
      companyId,
      createdBy: userId,
    });
    return res.status(201).json({
      message: "Job added successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
  }
};
export const list = async (req, res) => {
  try {
    let { page, pageSize, sortKey, sortType, keyword } = req.query;
    page = parseInt(req.query.page) || 1;
    const limit = parseInt(pageSize) || 10;
    const skip = (page - 1) * limit;

    if (keyword) keyword = keyword.trim();

    const sortPattern = {};

    if (sortKey && sortType) {
      sortPattern[sortKey] = sortType === "asc" ? 1 : -1;
    } else {
      sortPattern["createdAt"] = -1;
    }

    const matchQuery = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { location: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const jobsAggregation = await Job.aggregate([
      { $match: matchQuery },
      { $sort: sortPattern },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: {
          path: "$companyDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          location: 1,
          createdAt: 1,
          companyDetails: {
            _id: 1,
            name: 1,
            industry: 1,
            website: 1,
          },
        },
      },
    ]);
    console.log("jobsAggregation", jobsAggregation);

    const totalJobs = await Job.countDocuments(matchQuery);

    if (totalJobs === 0) {
      return res.status(404).json({
        message: "No jobs found.",
        status: false,
        totalJobs: 0,
      });
    }

    return res.status(200).json({
      message: "Jobs fetched successfully.",
      jobs: jobsAggregation,
      totalJobs,
      page,
      pageSize: limit,
      totalJobs: Math.ceil(totalJobs / limit),
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const update = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error", error);
  }
};
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const totalJobs = await Job.countDocuments(jobId);

    if (totalJobs === 0) {
      return res.status(404).json({
        message: "No jobs found.",
        status: false,
        totalJobs: 0,
      });
    }

    const jobs = await Job.findById(jobId);
    return res.status(200).json({
      message: "jobs fetched successfully.",
      jobs,
      totalJobs,
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
  }
};
export const getAdminJobs = async (req, res) => {
  try {
    const jobId = req.params.id;
    const totalJobs = await Job.countDocuments({ createdBy: jobId });

    if (totalJobs === 0) {
      return res.status(404).json({
        message: "No jobs found.",
        status: false,
        totalJobs: 0,
      });
    }

    const jobs = await Job.find({ createdBy: jobId });
    if (Array.isArray(jobs) && jobs.length === 0) {
      return res.status(404).json({
        message: "No job found.",
        status: false,
      });
    }
    return res.status(200).json({
      message: "jobs fetched successfully.",
      jobs,
      totalJobs,
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
  }
};

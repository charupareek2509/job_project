import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job Id rfequired.",
        success: false,
      });
    }
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(400).json({
        message: "job not found.",
        success: false,
      });
    }
    //create new application
    const applicationData = {
      applicant: userId,
      job: jobId,
    };
    const newApplication = await Application.create(applicationData);

    job.application.push(newApplication._id);
    await job.save();
    return res.status(201).json({
      message: "Internal Server Error",
      success: false,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getApplyJobs = async (req, res) => {
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

    const applicationAggregation = await Application.aggregate([
      { $match: matchQuery },
      { $sort: sortPattern },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "applicant",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: {
          path: "$jobDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          jobs: 1,
          createdAt: 1,
          userDetails: {
            _id: 1,
            fullName: 1,
            email: 1,
            mobileNumber: 1,
          },
          jobDetails: {
            _id: 1,
            title: 1,
            descrition: 1,
            jobType: 1,
            salary: 1,
            location: 1,
          },
        },
      },
    ]);

    const totalApplications = await Application.countDocuments(matchQuery);

    if (totalApplications === 0) {
      return res.status(404).json({
        message: "No application found.",
        status: false,
        totalApplication: 0,
      });
    }

    return res.status(200).json({
      message: "Applications fetched successfully.",
      jobs: applicationAggregation,
      totalApplications,
      page,
      pageSize: limit,
      totalApplications: Math.ceil(totalApplications / limit),
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

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
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
    const job = await Application.aggregate([
      { $match: { job: new mongoose.Types.ObjectId(jobId) } },
      { $sort: sortPattern },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: {
          path: "$jobDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "applicant",
          foreignField: "_id",
          as: "applicantDetails",
        },
      },
      {
        $unwind: {
          path: "$applicantDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          jobs: 1,
          createdAt: 1,
          applicantDetails: {
            fullName: 1,
            email: 1,
            mobileNumber: 1,
          },
          jobDetails: {
            _id: 1,
            title: 1,
            descrition: 1,
            jobType: 1,
            salary: 1,
            location: 1,
          },
        },
      },
    ]);

    if (!job) {
      return res.status(404).json({
        message: "Jobs not found!.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
        success: false,
      });
    }
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application is required.",
        success: false,
      });
    }
    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({
      message: "Status changes successfully!",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
  }
};

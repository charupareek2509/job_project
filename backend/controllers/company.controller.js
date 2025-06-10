import { Company } from "../models/company.model.js";
export const registerCompany = async (req, res) => {
  try {
    const { companyName, location, description, website } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is reqyuired. ",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });

    if (company) {
      return res.status(400).json({
        message: "You can't registered same company.",
        success: false,
      });
    }
    let companyDetails = {
      name: companyName,
      userId: req.id,
    };
    if (location) companyDetails.location = location;
    if (website) companyDetails.website = website;
    if (description) companyDetails.description = description;

    console.log("companyDetails0", companyDetails);

    company = await Company.create(companyDetails);
    console.log("company", company);

    return res.status(200).json({
      message: "Company registered successfully.",
      success: true,
      company,
    });
  } catch (error) {
    console.log("error", error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        messsage: "Companies not found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "List of comanies fetched succesdfully.",
      success: true,
      list: companies,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found!",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    const updateData = { name, description, website, location };
    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!company) {
      return res.status(404).json({
        message: "Company not found!",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company info updated successfully.",
      updateData,
      success: true,
    });
  } catch (error) {
    console.log("error", error);
  }
};

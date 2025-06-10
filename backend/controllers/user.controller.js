import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log("req", req.body);

  try {
    const { fullName, email, mobileNumber, password, role } = req.body;
    console.log("TCL: register -> req.body", req.body);
    console.log("fullName", fullName);

    if (!fullName || !email || !mobileNumber || !password || !role) {
      return res.status(400).json({
        message: "please fill the required fields",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already registered with this email Id.",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      role,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      req.res.status(400).json({
        message: "please fill the required fields",
        success: false,
      });
    }
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email/password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email/password.",
        success: false,
      });
    }
    //check role is correct or not
    if (role != user.role) {
      return res.status(400).json({
        message: "Account does not exist  with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (error) {
    return error;
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    return error;
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, bio, skills } = req.body;

    const profilePic = req.file;

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",").map((skill) => skill.trim());
      console.log("TCL: updateProfile -> skillsArray", skillsArray);
    }

    const userId = req.id;

    let user = await User.findById(userId);
    if (!user)
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (bio) user.profile.bio = bio;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (skills) user.profile.skills = skillsArray;

    // resume part will be here
    await user.save();
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user: user,
    });
  } catch (error) {
    return error;
  }
};

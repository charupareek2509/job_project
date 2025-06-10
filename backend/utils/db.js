import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb connect successfully");
  } catch (err) {
    console.log("errorr");
  }
};

export default connectDb;

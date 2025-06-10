// // export const handleListRequest = async (data) => {
// //   let { page, pageSize, keyword, sortKey, sortType } = data;
// //   let whereStatement = {};
// //   let condition = {};

// //   page = parseInt(page) || 1;
// //   const limit = parseInt(pageSize) || 10;
// //   const skip = (page - 1) * limit;

// //   if (keyword) {
// //     keyword = keyword.trim();
// //     condition["$or"] = [
// //       { title: { $regex: keyword, $options: "i" } },
// //       { location: { $regex: keyword, $options: "i" } },
// //     ];
// //   }

// //   const finalCondition = { ...whereStatement, ...condition };
// //   const sortPattern = {};

// //   if (sortKey && sortType) {
// //     sortPattern[sortKey] = sortType === "asc" ? 1 : -1;
// //   } else {
// //     sortPattern["createdAt"] = -1;
// //   }

// //   return { finalCondition, sortPattern, skip, limit };
// // };

// export const handleListRequest = async ({
//   model,
//   query,
//   searchFields,
//   sort,
//   pagination,
//   req,
// }) => {
//   try {
//     // Pagination settings
//     const { skip, limit } = pagination || { skip: 0, limit: 10 };

//     // Searching logic (if searchFields exist)
//     if (req.query.keyword && searchFields.length) {
//       const keyword = req.query.keyword.trim();
//       query["$or"] = searchFields.map((field) => ({
//         [field]: { $regex: keyword, $options: "i" },
//       }));
//     }

//     // Fetch total record count
//     const totalRecords = await model.countDocuments(query);

//     // Fetch filtered and sorted records
//     const data = await model
//       .find(query)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     return {
//       success: true,
//       data,
//       totalRecords,
//       page: Math.ceil(skip / limit) + 1,
//       pageSize: limit,
//       totalPages: Math.ceil(totalRecords / limit),
//     };
//   } catch (error) {
//     console.error("Error in commonListHelper:", error);
//     return { success: false, message: "Error fetching data" };
//   }
// };

// export const list = async (req, res) => {
//   try {
//     // Extract query parameters from request
//     let { page, pageSize, keyword, sortKey, sortType } = req.query;

//     // Set default pagination values
//     page = parseInt(page) || 1;
//     pageSize = parseInt(pageSize) || 10;
//     const skip = (page - 1) * pageSize;

//     // Initialize filtering conditions
//     let whereStatement = {};
//     let condition = {};

//     if (keyword) {
//       keyword = keyword.trim();
//       condition["$or"] = [
//         { title: { $regex: keyword, $options: "i" } },
//         { location: { $regex: keyword, $options: "i" } },
//       ];
//     }

//     const finalCondition = { ...whereStatement, ...condition };

//     // Sorting logic
//     const sortPattern = {};
//     if (sortKey && sortType) {
//       sortPattern[sortKey] = sortType === "asc" ? 1 : -1;
//     } else {
//       sortPattern["createdAt"] = -1;
//     }

//     // Fetch list using helper function
//     const result = await handleListRequest({
//       model: model,
//       query: finalCondition, // Apply filtering
//       searchFields: ["title", "location"], // Search fields for filtering
//       sort: sortPattern, // Sorting order
//       pagination: { skip, limit: pageSize }, // Pagination
//       req,
//     });

//     // Handle response
//     if (!result.success) {
//       return res.status(500).json(result);
//     }

//     if (result.totalRecords === 0) {
//       return res.status(404).json({
//         message: "No jobs found.",
//         status: false,
//         totalJobs: 0,
//       });
//     }

//     return res.status(200).json({
//       message: "Jobs fetched successfully.",
//       jobs: result.data,
//       totalJobs: result.totalRecords,
//       page: result.page,
//       pageSize: result.pageSize,
//       totalPages: result.totalPages,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

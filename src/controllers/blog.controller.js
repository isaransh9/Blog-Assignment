import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
  console.log("createBlog API Called");
  const { title, content } = req.body;
  const authorId = req.user._id;

  if ([title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required!!");
  }

  let fileLink = null;

  if (req.files && req.files.blogPicture && req.files.blogPicture.length > 0) {
    const pictureLocalPath = req.files.blogPicture[0].path;
    if (pictureLocalPath) {
      fileLink = await uploadOnCloudinary(pictureLocalPath);
      if (!fileLink) {
        throw new ApiError(400, "Failed to upload on cloudinary!!");
      }
    }
  }

  const createdBlog = await Blog.create({
    title,
    content,
    author: authorId,
  });

  if (fileLink) {
    await createdBlog.updateOne({ blogPicture: fileLink.url });
  }

  if (!createdBlog) {
    throw new ApiError(400, "Not able to create blog!!");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { blogs: createdBlog._id } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog created Successfully!!", updatedUser));
});

const updateBlog = asyncHandler(async (req, res) => {
  console.log("UpdateBlog API Called");
  const blogId = req.params.id;
  const { title, content } = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    { title: title, content: content },
    { new: true }
  );

  if (!updatedBlog) {
    throw new ApiError(400, "Not able to update blog!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog updated successfully!!", updatedBlog));
});

const deleteBlog = asyncHandler(async (req, res) => {
  console.log("deleteBlog API Called");
  const blogId = req.params.id;
  const deletedBlog = await Blog.findByIdAndDelete(blogId);

  if (!deletedBlog) {
    throw new ApiError(400, "Not able to delete blog!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog deleted successfully!!"));
});

const retreiveAllBlogs = asyncHandler(async (req, res) => {
  console.log("retreiveAllBlogs API Called");
  const allBlogs = await Blog.find();
  return res
    .status(200)
    .json(new ApiResponse(200, "All blogs fetched successfully!!", allBlogs));
});

const retreiveSingleblog = asyncHandler(async (req, res) => {
  console.log("retreiveSingleblog API Called");
  const blogId = req.params.id;

  const singleBlog = await Blog.findById(blogId);

  if (!singleBlog) {
    throw new ApiError(400, "Blog not found!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Single blog fetched successfully!!", singleBlog)
    );
});

// As these filter API is a get request so i am assuming that the title and author name will be passed as params in the url
const filterByTitle = asyncHandler(async (req, res) => {
  console.log("filterByTitle API Called");
  const title = req.params.title;

  const filteredBlogs = await Blog.find({ title });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Filtered blogs fetched successfully!!",
        filteredBlogs
      )
    );
});

// filtering by author name using aggregation pipeline
const filterByAuthor = asyncHandler(async (req, res) => {
  console.log("filterByAuthor API Called");
  const author = req.params.author;
  const filteredBlogs = await Blog.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $match: {
        "user.fullName": author,
      },
    },
    {
      $project: {
        "user.password": 0,
        "user.refreshToken": 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Filtered blogs fetched successfully!!",
        filteredBlogs
      )
    );
});

export {
  createBlog,
  updateBlog,
  deleteBlog,
  retreiveAllBlogs,
  retreiveSingleblog,
  filterByAuthor,
  filterByTitle,
};

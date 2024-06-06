import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  updateBlog,
  retreiveAllBlogs,
  retreiveSingleblog,
  filterByAuthor,
  filterByTitle
} from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// CRUD operation on blog post
router.route("/createBlog").post(
  upload.fields([
    // Middleware
    {
      name: "blogPicture",
      minCount: 0,
    },
  ]),
  verifyJWT,
  createBlog
);

router.route("/deleteBlog/:id").delete(verifyJWT, deleteBlog);

router.route("/updateBlog/:id").put(verifyJWT, updateBlog);

// retrieve the blog
router.route("/singleBlog/:id").get(verifyJWT, retreiveSingleblog);

router.route("/allBlog").get(verifyJWT, retreiveAllBlogs);

// filter routes
router.route("/filterByTitle/:title").get(verifyJWT,filterByTitle);

router.route("/filterByAuthor/:author").get(verifyJWT,filterByAuthor);

export default router;

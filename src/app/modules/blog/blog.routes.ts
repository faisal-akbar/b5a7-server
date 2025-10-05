import express from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { Role } from "@prisma/client";
import { BlogController } from "./blog.controller";
import { createBlogZodSchema, updateBlogZodSchema } from "./blog.validation";

const router = express.Router();

// Admin, Super Admin -- get published, unpublished
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BlogController.getAllBlogs
);

// public -- get published only
router.get("/published", BlogController.getAllPublishedBlogs);

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createBlogZodSchema),
  BlogController.createBlog
);

router.get("/views/:slug", BlogController.getBlogViews);
router.post("/views/:slug/increment", BlogController.incrementBlogViews);
router.get(
  "/id/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BlogController.getBlogById
);

router.get("/:slug", BlogController.getSingleBlog);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(updateBlogZodSchema),
  BlogController.updateBlog
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BlogController.deleteBlog
);

export const BlogRoutes = router;

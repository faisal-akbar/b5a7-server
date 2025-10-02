import { Blog } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { blogFilterableFields } from "./blog.constant";
import { BlogService } from "./blog.service";

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const payload: Blog = {
    ...req.body,
    thumbnail: req.file?.path,
  };

  const decodedToken = req.user as JwtPayload;

  const result = await BlogService.createBlog(payload, decodedToken);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, blogFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await BlogService.getAllBlogs(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const blogId = parseInt(req.params.id);
  const result = await BlogService.getBlogById(blogId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrieved successfully",
    data: result.data,
  });
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await BlogService.getSingleBlog(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrieved successfully",
    data: result.data,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const payload: Blog = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  const result = await BlogService.updateBlog(parseInt(req.params.id), payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});
const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogService.deleteBlog(parseInt(id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully",
    data: result,
  });
});

const getBlogViews = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const views = await BlogService.getBlogViews(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog views retrieved successfully",
    data: views,
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  getBlogViews,
};

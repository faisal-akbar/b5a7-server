import { Blog, Prisma } from "@prisma/client";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import slugify from "slugify";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { prisma } from "../../config/db";
import { IPaginationOptions } from "../../interfaces/pagination";
import AppError from "../../utils/errorHelpers/AppError";
import { paginationHelper } from "../../utils/paginationHelper";
import { blogSearchableFields } from "./blog.constant";
import { IBlogFilterRequest } from "./blog.interface";

const convertFilterValue = (key: string, value: any) => {
  // Convert string booleans to actual booleans
  if (key === "isFeatured" || key === "isPublished") {
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
  }
  return value;
};

const createBlog = async (payload: Blog, decodedToken: JwtPayload) => {
  const existingBlog = await prisma.blog.findFirst({
    where: { title: payload.title },
  });
  if (existingBlog) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A blog with this title already exists."
    );
  }

  const slug = slugify(payload.title, { lower: true });

  const blog = await prisma.blog.create({
    data: { ...payload, slug, authorId: decodedToken.userId },
  });

  return blog;
};

// Public -- get published only
const getAllPublishedBlogs = async (
  filters: IBlogFilterRequest,
  options: IPaginationOptions
) => {
  return getAllBlogs({ ...filters, isPublished: true }, options);
};

// Admin, Super Admin -- get published, unpublished
const getAllBlogs = async (
  filters: IBlogFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, tags, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: blogSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (tags) {
    andConditions.push({
      tags: {
        hasSome: Array.isArray(tags) ? tags : [tags],
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        const convertedValue = convertFilterValue(
          key,
          (filterData as any)[key]
        );
        return {
          [key]: {
            equals: convertedValue,
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  const total = await prisma.blog.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getBlogById = async (id: number) => {
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog Not Found");
  }
  return {
    data: blog,
  };
};

const getSingleBlog = async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      slug,
      isPublished: true,
    },
  });

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog Not Found");
  }

  return {
    data: blog,
  };
};

const updateBlog = async (id: number, payload: Partial<Blog>) => {
  const existingBlog = await prisma.blog.findUnique({ where: { id } });

  if (!existingBlog) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog Not Found");
  }

  const duplicateBlog = await prisma.blog.findFirst({
    where: {
      title: payload.title,
      id: { not: id },
    },
  });

  if (duplicateBlog) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A blog with this title already exists."
    );
  }

  const slug = payload.title
    ? slugify(payload.title, { lower: true })
    : existingBlog.slug;

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: { ...payload, slug },
  });

  if (payload.thumbnail && existingBlog.thumbnail) {
    await deleteImageFromCLoudinary(existingBlog.thumbnail);
  }

  return updatedBlog;
};

const deleteBlog = async (id: number) => {
  return await prisma.blog.delete({ where: { id } });
};

// Get current view count without incrementing
const getBlogViews = async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { views: true },
  });

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }

  return blog;
};

// Increment view count (for when user actually views the blog)
const incrementBlogViews = async (slug: string) => {
  return await prisma.$transaction(async (tx) => {
    // First check if the blog exists
    const existingBlog = await tx.blog.findUnique({
      where: { slug },
      select: { id: true, views: true },
    });

    if (!existingBlog) {
      throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
    }

    // Increment views and return updated count
    const updatedBlog = await tx.blog.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
      select: { views: true },
    });

    return updatedBlog;
  });
};

export const BlogService = {
  createBlog,
  getSingleBlog,
  getBlogById,
  getAllBlogs,
  getAllPublishedBlogs,
  updateBlog,
  deleteBlog,
  getBlogViews,
  incrementBlogViews,
};

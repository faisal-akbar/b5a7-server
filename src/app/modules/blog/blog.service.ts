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
  console.log(payload);

  const slug = slugify(payload.title, { lower: true });

  const blog = await prisma.blog.create({
    data: { ...payload, slug, authorId: decodedToken.userId },
  });

  return blog;
};

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
      author: true,
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

const getSingleBlog = async (slug: string) => {
  const blog = await prisma.blog.findUnique({ where: { slug } });

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

export const BlogService = {
  createBlog,
  getSingleBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
};

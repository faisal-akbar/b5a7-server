import { Prisma, Project } from "@prisma/client";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { prisma } from "../../config/db";
import { IPaginationOptions } from "../../interfaces/pagination";
import AppError from "../../utils/errorHelpers/AppError";
import { paginationHelper } from "../../utils/paginationHelper";
import { projectSearchableFields } from "./project.constant";
import { IProjectFilterRequest } from "./project.interface";

const convertFilterValue = (key: string, value: any) => {
  // Convert string booleans to actual booleans
  if (key === "isFeatured" || key === "isPublished") {
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
  }
  return value;
};

const createProject = async (payload: Project, decodedToken: JwtPayload) => {
  const existingProject = await prisma.project.findFirst({
    where: { title: payload.title },
  });
  if (existingProject) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A project with this title already exists."
    );
  }

  // Generate slug from title if not provided
  const slug = payload.title.toLowerCase().split(" ").join("-");

  const project = await prisma.project.create({
    data: { ...payload, slug, ownerId: decodedToken.userId },
  });

  return project;
};

const getAllProjects = async (
  filters: IProjectFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, techStack, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: projectSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (techStack) {
    andConditions.push({
      techStack: {
        hasSome: Array.isArray(techStack) ? techStack : [techStack],
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

  const whereConditions: Prisma.ProjectWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.project.findMany({
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
      owner: true,
    },
  });
  const total = await prisma.project.count({
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

const getSingleProject = async (slug: string) => {
  const project = await prisma.project.findUnique({ where: { slug } });

  return {
    data: project,
  };
};

const updateProject = async (id: number, payload: Partial<Project>) => {
  const existingProject = await prisma.project.findUnique({ where: { id } });

  if (!existingProject) {
    throw new AppError(httpStatus.NOT_FOUND, "Project Not Found");
  }

  const duplicateProject = await prisma.project.findFirst({
    where: {
      title: payload.title,
      id: { not: id },
    },
  });

  if (duplicateProject) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A project with this title already exists."
    );
  }

  const slug = payload.title
    ? payload.title.toLowerCase().split(" ").join("-")
    : existingProject.slug;

  const updatedProject = await prisma.project.update({
    where: { id },
    data: { ...payload, slug },
  });

  if (payload.thumbnail && existingProject.thumbnail) {
    await deleteImageFromCLoudinary(existingProject.thumbnail);
  }

  return updatedProject;
};

const deleteProject = async (id: number) => {
  return await prisma.project.delete({ where: { id } });
};

export const ProjectService = {
  createProject,
  getSingleProject,
  getAllProjects,
  updateProject,
  deleteProject,
};

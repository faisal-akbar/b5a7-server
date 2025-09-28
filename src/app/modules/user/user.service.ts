import { IsActive, Role, User } from "@prisma/client";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../config/db";
import { envVars } from "../../config/env";
import AppError from "../../utils/errorHelpers/AppError";

const updateUser = async (
  userId: string,
  payload: Partial<User>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.USER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const ifUserExist = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (
    decodedToken.role === Role.ADMIN &&
    ifUserExist.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (
    payload.isActive === IsActive.BLOCKED ||
    payload.isActive === IsActive.INACTIVE ||
    payload.isDeleted ||
    payload.isVerified
  ) {
    if (decodedToken.role === Role.USER) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      ...payload,
    },
  });

  return newUpdatedUser;
};

const getMe = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return {
    data: user,
  };
};

const createAdmin = async (
  payload: Partial<User>,
  decodedToken: JwtPayload
) => {
  const { email, password, role, ...rest } = payload;

  const isUserExist = await prisma.user.findUnique({ where: { email } });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  if (decodedToken.role == Role.ADMIN && role === Role.SUPER_ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to create SUPER_ADMIN"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const UserServices = {
  updateUser,
  getMe,
  createAdmin,
};

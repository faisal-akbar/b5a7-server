import { Role, User } from "@prisma/client";
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

  const newUpdatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      ...payload,
    },
  });

  return newUpdatedUser;
};

const getMe = async (userId: number) => {
  const user = await prisma.user.findUnique({
    omit: { password: true },
    where: { id: userId },
  });

  return {
    data: user,
  };
};

const createAdmin = async (
  payload: Partial<User>,
  decodedToken: JwtPayload
) => {
  const { name, email, password, ...rest } = payload;

  if (!name || !email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Name, Email, Password are required"
    );
  }

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
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      ...rest,
    },
  });

  return user;
};

export const UserServices = {
  updateUser,
  getMe,
  createAdmin,
};

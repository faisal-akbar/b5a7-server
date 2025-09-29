/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { deleteImageFromCLoudinary } from "../config/cloudinary.config";
import { envVars } from "../config/env";
import { IGenericErrorMessage } from "../interfaces/error";
import AppError from "../utils/errorHelpers/AppError";
import handleClientError from "../utils/errorHelpers/handleClientError";
import handleValidationError from "../utils/errorHelpers/handleValidationError";
import handleZodError from "../utils/errorHelpers/handleZodError";
import { errorLogger } from "../utils/logger";

const globalErrorHandler: ErrorRequestHandler = async (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  envVars.NODE_ENV === "development"
    ? console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
    : errorLogger.error(`🐱‍🏍 globalErrorHandler ~~`, error);

  if (req.file) {
    await deleteImageFromCLoudinary(req.file.path);
  }

  let statusCode = 500;
  let message = "Something went wrong !";
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: envVars.NODE_ENV !== "production" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;

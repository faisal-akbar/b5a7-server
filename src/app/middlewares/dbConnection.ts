import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";

export const ensureDbConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Test the database connection
    await prisma.$queryRaw`SELECT 1`;
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error:
        process.env.NODE_ENV === "development"
          ? error
          : "Internal server error",
    });
  }
};

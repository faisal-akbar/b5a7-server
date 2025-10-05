import { PrismaClient } from "@prisma/client";

// Global variable to store the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client for serverless environments
export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // omit: {
    //   user: { password: true },
    // },
  });

// In development, store the client on the global object to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
};

// Graceful shutdown
export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log("Database disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting from database:", error);
  }
};

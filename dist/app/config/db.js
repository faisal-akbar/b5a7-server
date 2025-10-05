"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Create a singleton Prisma client for serverless environments
exports.prisma = globalThis.__prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
        // omit: {
        //   user: { password: true },
        // },
    });
// In development, store the client on the global object to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
    globalThis.__prisma = exports.prisma;
}
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.prisma.$connect();
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Failed to connect to database:", error);
        throw error;
    }
});
exports.connectDatabase = connectDatabase;
// Graceful shutdown
const disconnectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.prisma.$disconnect();
        console.log("Database disconnected successfully");
    }
    catch (error) {
        console.error("Error disconnecting from database:", error);
    }
});
exports.disconnectDatabase = disconnectDatabase;

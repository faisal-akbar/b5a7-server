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
exports.ensureDbConnection = void 0;
const db_1 = require("../config/db");
const ensureDbConnection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test the database connection
        yield db_1.prisma.$queryRaw `SELECT 1`;
        next();
    }
    catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: process.env.NODE_ENV === "development"
                ? error
                : "Internal server error",
        });
    }
});
exports.ensureDbConnection = ensureDbConnection;

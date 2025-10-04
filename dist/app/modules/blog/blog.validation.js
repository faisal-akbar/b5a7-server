"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogZodSchema = exports.createBlogZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBlogZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ invalid_type_error: "Title must be string" })
        .min(2, { message: "Title must be at least 2 characters long." })
        .max(200, { message: "Title cannot exceed 200 characters." }),
    excerpt: zod_1.default
        .string()
        .min(1, "Excerpt is required")
        .max(300, "Excerpt must be less than 300 characters"),
    tags: zod_1.default.array(zod_1.default.string()).optional(),
    isFeatured: zod_1.default
        .boolean({ invalid_type_error: "isFeatured must be true or false" })
        .optional(),
    isPublished: zod_1.default
        .boolean({ invalid_type_error: "isPublished must be true or false" })
        .optional(),
    content: zod_1.default
        .string({ invalid_type_error: "Content must be string" })
        .min(10, { message: "Content must be at least 10 characters long." })
        .max(50000, { message: "Content cannot exceed 50000 characters." }),
});
exports.updateBlogZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ invalid_type_error: "Title must be string" })
        .min(2, { message: "Title must be at least 2 characters long." })
        .max(200, { message: "Title cannot exceed 200 characters." })
        .optional(),
    excerpt: zod_1.default
        .string()
        .min(1, "Excerpt is required")
        .max(300, "Excerpt must be less than 300 characters")
        .optional(),
    tags: zod_1.default.array(zod_1.default.string()).optional(),
    isFeatured: zod_1.default
        .boolean({ invalid_type_error: "isFeatured must be true or false" })
        .optional(),
    isPublished: zod_1.default
        .boolean({ invalid_type_error: "isPublished must be true or false" })
        .optional(),
    content: zod_1.default
        .string({ invalid_type_error: "Content must be string" })
        .min(10, { message: "Content must be at least 10 characters long." })
        .max(50000, { message: "Content cannot exceed 50000 characters." })
        .optional(),
});

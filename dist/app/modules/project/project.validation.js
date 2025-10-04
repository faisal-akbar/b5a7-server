"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectZodSchema = exports.createProjectZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createProjectZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ invalid_type_error: "Title must be string" })
        .min(2, { message: "Title must be at least 2 characters long." })
        .max(200, { message: "Title cannot exceed 200 characters." }),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be string" })
        .min(10, { message: "Description must be at least 10 characters long." })
        .max(2000, { message: "Description cannot exceed 2000 characters." }),
    projectLink: zod_1.default
        .string({ invalid_type_error: "Project link must be string" })
        .url({ message: "Project link must be a valid URL." }),
    liveSite: zod_1.default
        .string({ invalid_type_error: "Live site must be string" })
        .url({ message: "Live site must be a valid URL." }),
    features: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Each feature must be string" }), {
        invalid_type_error: "Features must be an array of strings",
    })
        .min(1, { message: "At least one feature is required." })
        .max(20, { message: "Cannot have more than 20 features." }),
    techStack: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Each tech stack item must be string" }), {
        invalid_type_error: "Tech stack must be an array of strings",
    })
        .min(1, { message: "At least one tech stack item is required." })
        .max(20, { message: "Cannot have more than 20 tech stack items." }),
    isFeatured: zod_1.default
        .boolean({ invalid_type_error: "isFeatured must be true or false" })
        .optional(),
    isPublished: zod_1.default
        .boolean({ invalid_type_error: "isPublished must be true or false" })
        .optional(),
});
exports.updateProjectZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ invalid_type_error: "Title must be string" })
        .min(2, { message: "Title must be at least 2 characters long." })
        .max(200, { message: "Title cannot exceed 200 characters." })
        .optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be string" })
        .min(10, { message: "Description must be at least 10 characters long." })
        .max(2000, { message: "Description cannot exceed 2000 characters." })
        .optional(),
    projectLink: zod_1.default
        .string({ invalid_type_error: "Project link must be string" })
        .url({ message: "Project link must be a valid URL." })
        .optional(),
    liveSite: zod_1.default
        .string({ invalid_type_error: "Live site must be string" })
        .url({ message: "Live site must be a valid URL." })
        .optional(),
    features: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Each feature must be string" }), {
        invalid_type_error: "Features must be an array of strings",
    })
        .min(1, { message: "At least one feature is required." })
        .max(20, { message: "Cannot have more than 20 features." })
        .optional(),
    techStack: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Each tech stack item must be string" }), {
        invalid_type_error: "Tech stack must be an array of strings",
    })
        .min(1, { message: "At least one tech stack item is required." })
        .max(30, { message: "Cannot have more than 30 tech stack items." })
        .optional(),
    isFeatured: zod_1.default
        .boolean({ invalid_type_error: "isFeatured must be true or false" })
        .optional(),
    isPublished: zod_1.default
        .boolean({ invalid_type_error: "isPublished must be true or false" })
        .optional(),
    isDeleted: zod_1.default
        .boolean({ invalid_type_error: "isDeleted must be true or false" })
        .optional(),
});

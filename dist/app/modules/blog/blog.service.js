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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const slugify_1 = __importDefault(require("slugify"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const db_1 = require("../../config/db");
const AppError_1 = __importDefault(require("../../utils/errorHelpers/AppError"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const blog_constant_1 = require("./blog.constant");
const convertFilterValue = (key, value) => {
    // Convert string booleans to actual booleans
    if (key === "isFeatured" || key === "isPublished") {
        if (typeof value === "string") {
            return value.toLowerCase() === "true";
        }
    }
    return value;
};
const createBlog = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBlog = yield db_1.prisma.blog.findFirst({
        where: { title: payload.title },
    });
    if (existingBlog) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A blog with this title already exists.");
    }
    const slug = (0, slugify_1.default)(payload.title, { lower: true });
    const blog = yield db_1.prisma.blog.create({
        data: Object.assign(Object.assign({}, payload), { slug, authorId: decodedToken.userId }),
    });
    return blog;
});
// Public -- get published only
const getAllPublishedBlogs = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    return getAllBlogs(Object.assign(Object.assign({}, filters), { isPublished: true }), options);
});
// Admin, Super Admin -- get published, unpublished
const getAllBlogs = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, tags } = filters, filterData = __rest(filters, ["searchTerm", "tags"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: blog_constant_1.blogSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (tags) {
        andConditions.push({
            tags: {
                hasSome: Array.isArray(tags) ? tags : [tags],
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                const convertedValue = convertFilterValue(key, filterData[key]);
                return {
                    [key]: {
                        equals: convertedValue,
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield db_1.prisma.blog.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: "desc",
            },
        include: {
            author: {
                select: {
                    name: true,
                },
            },
        },
    });
    const total = yield db_1.prisma.blog.count({
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
});
const getBlogById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield db_1.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Blog Not Found");
    }
    return {
        data: blog,
    };
});
const getSingleBlog = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield db_1.prisma.blog.findUnique({
        where: {
            slug,
            isPublished: true,
        },
    });
    if (!blog) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Blog Not Found");
    }
    return {
        data: blog,
    };
});
const updateBlog = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBlog = yield db_1.prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Blog Not Found");
    }
    if (payload.title) {
        const duplicateBlog = yield db_1.prisma.blog.findFirst({
            where: {
                title: payload.title,
                id: { not: id },
            },
        });
        if (duplicateBlog) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A blog with this title already exists.");
        }
    }
    const slug = payload.title
        ? (0, slugify_1.default)(payload.title, { lower: true })
        : existingBlog.slug;
    const updatedBlog = yield db_1.prisma.blog.update({
        where: { id },
        data: Object.assign(Object.assign({}, payload), { slug }),
    });
    if (payload.thumbnail && existingBlog.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(existingBlog.thumbnail);
    }
    return updatedBlog;
});
const deleteBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.blog.delete({ where: { id } });
});
// Get current view count without incrementing
const getBlogViews = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield db_1.prisma.blog.findUnique({
        where: { slug },
        select: { views: true },
    });
    if (!blog) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Blog not found");
    }
    return blog;
});
// Increment view count (for when user actually views the blog)
const incrementBlogViews = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // First check if the blog exists
        const existingBlog = yield tx.blog.findUnique({
            where: { slug },
            select: { id: true, views: true },
        });
        if (!existingBlog) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Blog not found");
        }
        // Increment views and return updated count
        const updatedBlog = yield tx.blog.update({
            where: { slug },
            data: {
                views: {
                    increment: 1,
                },
            },
            select: { views: true },
        });
        return updatedBlog;
    }));
});
exports.BlogService = {
    createBlog,
    getSingleBlog,
    getBlogById,
    getAllBlogs,
    getAllPublishedBlogs,
    updateBlog,
    deleteBlog,
    getBlogViews,
    incrementBlogViews,
};

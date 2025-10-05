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
exports.ProjectService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const slugify_1 = __importDefault(require("slugify"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const db_1 = require("../../config/db");
const AppError_1 = __importDefault(require("../../utils/errorHelpers/AppError"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const project_constant_1 = require("./project.constant");
const convertFilterValue = (key, value) => {
    // Convert string booleans to actual booleans
    if (key === "isFeatured" || key === "isPublished") {
        if (typeof value === "string") {
            return value.toLowerCase() === "true";
        }
    }
    return value;
};
const createProject = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const existingProject = yield db_1.prisma.project.findFirst({
        where: { title: payload.title },
    });
    if (existingProject) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A project with this title already exists.");
    }
    const slug = (0, slugify_1.default)(payload.title, { lower: true });
    const project = yield db_1.prisma.project.create({
        data: Object.assign(Object.assign({}, payload), { slug, ownerId: decodedToken.userId }),
    });
    return project;
});
// Public -- get published only
const getAllPublishedProjects = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    return getAllProjects(Object.assign(Object.assign({}, filters), { isPublished: true }), options);
});
const getAllProjects = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, techStack } = filters, filterData = __rest(filters, ["searchTerm", "techStack"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: project_constant_1.projectSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (techStack) {
        andConditions.push({
            techStack: {
                hasSome: Array.isArray(techStack) ? techStack : [techStack],
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
    const result = yield db_1.prisma.project.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: "desc",
            },
        include: {
            owner: {
                select: {
                    name: true,
                },
            },
        },
    });
    const total = yield db_1.prisma.project.count({
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
const getProjectById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield db_1.prisma.project.findUnique({ where: { id } });
    if (!project) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Project Not Found");
    }
    return {
        data: project,
    };
});
const getSingleProject = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield db_1.prisma.project.findUnique({ where: { slug } });
    return {
        data: project,
    };
});
const updateProject = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingProject = yield db_1.prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Project Not Found");
    }
    if (payload.title) {
        const duplicateProject = yield db_1.prisma.project.findFirst({
            where: {
                title: payload.title,
                id: { not: id },
            },
        });
        if (duplicateProject) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A project with this title already exists.");
        }
    }
    const slug = payload.title
        ? (0, slugify_1.default)(payload.title, { lower: true })
        : existingProject.slug;
    const updatedProject = yield db_1.prisma.project.update({
        where: { id },
        data: Object.assign(Object.assign({}, payload), { slug }),
    });
    if (payload.thumbnail && existingProject.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(existingProject.thumbnail);
    }
    return updatedProject;
});
const deleteProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.project.delete({ where: { id } });
});
exports.ProjectService = {
    createProject,
    getProjectById,
    getSingleProject,
    getAllProjects,
    updateProject,
    deleteProject,
    getAllPublishedProjects,
};

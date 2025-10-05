"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const client_1 = require("@prisma/client");
const blog_controller_1 = require("./blog.controller");
const blog_validation_1 = require("./blog.validation");
const router = express_1.default.Router();
// Admin, Super Admin -- get published, unpublished
router.get("/", (0, checkAuth_1.checkAuth)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), blog_controller_1.BlogController.getAllBlogs);
// public -- get published only
router.get("/published", blog_controller_1.BlogController.getAllPublishedBlogs);
router.post("/create", (0, checkAuth_1.checkAuth)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single("file"), (0, validateRequest_1.validateRequest)(blog_validation_1.createBlogZodSchema), blog_controller_1.BlogController.createBlog);
router.get("/views/:slug", blog_controller_1.BlogController.getBlogViews);
router.post("/views/:slug/increment", blog_controller_1.BlogController.incrementBlogViews);
router.get("/id/:id", (0, checkAuth_1.checkAuth)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), blog_controller_1.BlogController.getBlogById);
router.get("/:slug", blog_controller_1.BlogController.getSingleBlog);
router.patch("/:id", (0, checkAuth_1.checkAuth)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single("file"), (0, validateRequest_1.validateRequest)(blog_validation_1.updateBlogZodSchema), blog_controller_1.BlogController.updateBlog);
router.delete("/:id", (0, checkAuth_1.checkAuth)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), blog_controller_1.BlogController.deleteBlog);
exports.BlogRoutes = router;

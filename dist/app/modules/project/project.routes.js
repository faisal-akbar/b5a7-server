"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const client_1 = require("@prisma/client");
const project_controller_1 = require("./project.controller");
const project_validation_1 = require("./project.validation");
const router = express_1.default.Router();
// Public -- get published only
router.get("/published", project_controller_1.ProjectController.getAllPublishedProjects);
// Admin, Super Admin -- get published, unpublished
router.get("/", (0, checkAuth_1.checkAuth)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), project_controller_1.ProjectController.getAllProjects);
router.post("/create", (0, checkAuth_1.checkAuth)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single("file"), (0, validateRequest_1.validateRequest)(project_validation_1.createProjectZodSchema), project_controller_1.ProjectController.createProject);
router.get("/id/:id", (0, checkAuth_1.checkAuth)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), project_controller_1.ProjectController.getProjectById);
router.get("/:slug", project_controller_1.ProjectController.getSingleProject);
router.patch("/:id", (0, checkAuth_1.checkAuth)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single("file"), (0, validateRequest_1.validateRequest)(project_validation_1.updateProjectZodSchema), project_controller_1.ProjectController.updateProject);
router.delete("/:id", (0, checkAuth_1.checkAuth)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), project_controller_1.ProjectController.deleteProject);
exports.ProjectRoutes = router;

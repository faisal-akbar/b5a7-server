import express from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { Role } from "@prisma/client";
import { ProjectController } from "./project.controller";
import {
  createProjectZodSchema,
  updateProjectZodSchema,
} from "./project.validation";

const router = express.Router();

router.get("/", ProjectController.getAllProjects);

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createProjectZodSchema),
  ProjectController.createProject
);

router.get(
  "/id/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ProjectController.getProjectById
);

router.get("/:slug", ProjectController.getSingleProject);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(updateProjectZodSchema),
  ProjectController.updateProject
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ProjectController.deleteProject
);

export const ProjectRoutes = router;

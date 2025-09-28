import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";

import { Role } from "@prisma/client";
import { createAdminZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.post(
  "/create-admin",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createAdminZodSchema),
  UserControllers.createAdmin
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);

export const UserRoutes = router;

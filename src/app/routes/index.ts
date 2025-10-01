import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BlogRoutes } from "../modules/blog/blog.routes";
import { ProjectRoutes } from "../modules/project/project.routes";
import { UserRoutes } from "../modules/user/user.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/project",
    route: ProjectRoutes,
  },
  {
    path: "/blog",
    route: BlogRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const blog_routes_1 = require("../modules/blog/blog.routes");
const project_routes_1 = require("../modules/project/project.routes");
const user_routes_1 = require("../modules/user/user.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/project",
        route: project_routes_1.ProjectRoutes,
    },
    {
        path: "/blog",
        route: blog_routes_1.BlogRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});

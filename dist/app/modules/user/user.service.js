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
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../utils/errorHelpers/AppError"));
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExist = yield db_1.prisma.user.findUnique({
        where: { id: Number(userId) },
    });
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (decodedToken.role === client_1.Role.ADMIN &&
        ifUserExist.role === client_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    const newUpdatedUser = yield db_1.prisma.user.update({
        where: { id: Number(userId) },
        data: Object.assign({}, payload),
    });
    return newUpdatedUser;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.findUnique({
        omit: { password: true },
        where: { id: userId },
    });
    return {
        data: user,
    };
});
const createAdmin = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = payload, rest = __rest(payload, ["name", "email", "password"]);
    if (!name || !email || !password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Name, Email, Password are required");
    }
    const isUserExist = yield db_1.prisma.user.findUnique({ where: { email } });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    if (decodedToken.role == client_1.Role.ADMIN && payload.role === client_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to create SUPER_ADMIN");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const user = yield db_1.prisma.user.create({
        data: Object.assign({ name,
            email, password: hashedPassword, isVerified: true }, rest),
    });
    return user;
});
exports.UserServices = {
    updateUser,
    getMe,
    createAdmin,
};

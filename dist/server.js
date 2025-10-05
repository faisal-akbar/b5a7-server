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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const db_1 = require("./app/config/db");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to database first
            yield (0, db_1.connectDatabase)();
            const server = app_1.default.listen(env_1.envVars.PORT, () => {
                console.log("Server is running on port ", env_1.envVars.PORT);
            });
            yield (0, seedSuperAdmin_1.seedSuperAdmin)();
            const exitHandler = () => __awaiter(this, void 0, void 0, function* () {
                if (server) {
                    server.close(() => __awaiter(this, void 0, void 0, function* () {
                        console.info("Server closed!");
                        yield (0, db_1.disconnectDatabase)();
                    }));
                }
                process.exit(1);
            });
            process.on("uncaughtException", (error) => {
                console.log(error);
                exitHandler();
            });
            process.on("unhandledRejection", (error) => {
                console.log(error);
                exitHandler();
            });
            // Graceful shutdown on SIGTERM and SIGINT
            process.on("SIGTERM", exitHandler);
            process.on("SIGINT", exitHandler);
        }
        catch (error) {
            console.error("Failed to start server:", error);
            yield (0, db_1.disconnectDatabase)();
            process.exit(1);
        }
    });
}
main();

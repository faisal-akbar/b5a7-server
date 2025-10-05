import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";
import { connectDatabase, disconnectDatabase } from "./app/config/db";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

async function main() {
  try {
    // Connect to database first
    await connectDatabase();
    
    const server: Server = app.listen(envVars.PORT, () => {
      console.log("Server is running on port ", envVars.PORT);
    });

    await seedSuperAdmin();

    const exitHandler = async () => {
      if (server) {
        server.close(async () => {
          console.info("Server closed!");
          await disconnectDatabase();
        });
      }
      process.exit(1);
    };

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
  } catch (error) {
    console.error("Failed to start server:", error);
    await disconnectDatabase();
    process.exit(1);
  }
}

main();

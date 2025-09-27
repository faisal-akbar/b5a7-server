import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";

async function main() {
  const server: Server = app.listen(envVars.PORT, () => {
    console.log("Sever is running on port ", envVars.PORT);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
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
}

main();

import "dotenv/config";
import app from "./app";

const port = Number(process.env.PORT ?? 3000);
const host = "0.0.0.0";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port");
}

const server = app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received; shutting down`);

  server.close((error) => {
    if (error) {
      console.error("Error during shutdown:", error);
      process.exitCode = 1;
    }
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));

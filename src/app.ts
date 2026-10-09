import express from "express";
import healthRouter from "./routes/health.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    name: "my-api",
    message: "API is running",
  });
});

app.use("/health", healthRouter);

// Return a JSON response for unknown routes.
app.use((_req, res) => {
  res.status(404).json({
    error: "Not found",
  });
});

export default app;

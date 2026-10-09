import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Express API", () => {
  it("GET / returns the API information", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      name: "my-api",
      message: "API is running",
    });
  });

  it("GET /health returns a healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.timestamp).toEqual(expect.any(String));

    expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
  });

  it("returns 404 for an unknown route", async () => {
    const response = await request(app).get("/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Not found",
    });
  });
});

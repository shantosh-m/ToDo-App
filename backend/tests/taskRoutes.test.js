import request from "supertest";
import express from "express";
import createTasksRouter from "../src/routes/tasks.js";
import { jest } from "@jest/globals";

let mockPool;
let app;
let createdTaskId;

beforeAll(() => {
  // Create a mock pool without affecting realDB
  mockPool = {
    query: jest.fn(),
  };

  app = express();
  app.use(express.json());
  app.use("/api/tasks", createTasksRouter(mockPool));
});

describe("Task Routes (Mocked DB)", () => {
  it("GET /api/tasks → should return list of tasks", async () => {
    // Mock response for SELECT query
    mockPool.query.mockResolvedValueOnce([
      [
        {
          id: 1,
          title: "Mock Task 1",
          description: "Desc 1",
          created_at: new Date(),
        },
        {
          id: 2,
          title: "Mock Task 2",
          description: "Desc 2",
          created_at: new Date(),
        },
      ],
    ]);

    const res = await request(app).get("/api/tasks");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("title", "Mock Task 1");
  });

  it("POST /api/tasks → should create a new task", async () => {
    const newTask = { title: "Task to Delete", description: "Delete test" };

    // Mock response for INSERT query
    mockPool.query.mockResolvedValueOnce([{ insertId: 123 }]);
    // Mock response for SELECT after insert
    mockPool.query.mockResolvedValueOnce([[{ id: 123, ...newTask }]]);

    const res = await request(app).post("/api/tasks").send(newTask);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id", 123);
    expect(res.body.title).toBe(newTask.title);

    createdTaskId = res.body.id;
  });

  it("POST /api/tasks → should fail without title", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ description: "Missing title" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Title is required");
  });

  it("DELETE /api/tasks/:id → should delete a task", async () => {
    // Mock response for DELETE query
    mockPool.query.mockResolvedValueOnce([{}]);

    const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(204); // No content
  });

  it("DELETE /api/tasks/:id → should handle non-existing task", async () => {
    // Mock response for DELETE of non-existing task
    mockPool.query.mockResolvedValueOnce([{}]);

    const res = await request(app).delete(`/api/tasks/999999`);
    expect(res.statusCode).toBe(204);
  });
});

describe("Task Routes (Mocked DB) - Error Handling", () => {
  it("GET /api/tasks → should return 500 if DB fails", async () => {
    // Simulate DB failure
    mockPool.query.mockRejectedValueOnce(new Error("DB error"));

    const res = await request(app).get("/api/tasks");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch tasks");
  });

  it("POST /api/tasks → should return 500 if DB insert fails", async () => {
    const newTask = { title: "Task Fail", description: "DB fail test" };

    // Simulate DB failure on insert
    mockPool.query.mockRejectedValueOnce(new Error("DB error"));

    const res = await request(app).post("/api/tasks").send(newTask);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to create task");
  });

  it("DELETE /api/tasks/:id → should return 500 if DB delete fails", async () => {
    // Simulate DB failure on delete
    mockPool.query.mockRejectedValueOnce(new Error("DB error"));

    const res = await request(app).delete(`/api/tasks/${createdTaskId}`);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to delete task");
  });
});

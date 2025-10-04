// taskHandlers.test.js
import { jest } from "@jest/globals";
import {
  getTasks,
  createTask,
  deleteTask,
} from "../src/handlers/taskHandlers.js";

describe("Task Handlers", () => {
  let pool;
  let res;

  beforeEach(() => {
    // Mock pool.query
    pool = {
      query: jest.fn(),
    };

    // Mock res object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("getTasks", () => {
    it("should fetch tasks successfully", async () => {
      const mockTasks = [{ id: 1, title: "Task 1", description: "Desc" }];
      pool.query.mockResolvedValue([mockTasks]);

      await getTasks(pool, res);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM task ORDER BY created_at DESC LIMIT 5"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should handle errors", async () => {
      pool.query.mockRejectedValue(new Error("DB Error"));

      await getTasks(pool, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch tasks" });
    });
  });

  describe("createTask", () => {
    it("should return 400 if title is missing", async () => {
      await createTask(pool, { description: "Desc" }, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Title is required" });
    });

    it("should create a task successfully", async () => {
      const taskData = { title: "New Task", description: "Desc" };
      const insertResult = { insertId: 1 };
      const insertedTask = [{ id: 1, ...taskData }];

      pool.query
        .mockResolvedValueOnce([insertResult]) // for INSERT
        .mockResolvedValueOnce([insertedTask]); // for SELECT

      await createTask(pool, taskData, res);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(insertedTask[0]);
    });

    it("should handle errors", async () => {
      const taskData = { title: "Task", description: "Desc" };
      pool.query.mockRejectedValue(new Error("DB Error"));

      await createTask(pool, taskData, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to create task" });
    });
  });

  describe("deleteTask", () => {
    it("should delete a task successfully", async () => {
      pool.query.mockResolvedValue();

      await deleteTask(pool, 1, res);

      expect(pool.query).toHaveBeenCalledWith("DELETE FROM task WHERE id = ?", [
        1,
      ]);
      expect(res.send).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should handle errors", async () => {
      pool.query.mockRejectedValue(new Error("DB Error"));

      await deleteTask(pool, 1, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to delete task" });
    });
  });
});

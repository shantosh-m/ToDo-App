import express from "express";

export default function createTasksRouter(pool) {
  const router = express.Router();

  // Get latest 5 tasks
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM task ORDER BY created_at DESC LIMIT 5"
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Create task
  router.post("/", async (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    try {
      const [result] = await pool.query(
        "INSERT INTO task (title, description, created_at) VALUES (?, ?, NOW())",
        [title, description]
      );
      const [task] = await pool.query("SELECT * FROM task WHERE id = ?", [
        result.insertId,
      ]);
      res.status(201).json(task[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  // Delete task
  router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await pool.query("DELETE FROM task WHERE id = ?", [id]);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  return router;
}

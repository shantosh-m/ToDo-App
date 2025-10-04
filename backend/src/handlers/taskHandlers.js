// taskHandlers.js

// Fetch last 5 tasks
export async function getTasks(pool, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM task ORDER BY created_at DESC LIMIT 5"
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

// Create a new task
export async function createTask(pool, { title, description }, res) {
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    // Insert task
    const [result] = await pool.query(
      "INSERT INTO task (title, description, created_at) VALUES (?, ?, NOW())",
      [title, description]
    );

    // Retrieve newly created task
    const [task] = await pool.query("SELECT * FROM task WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(task[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
}

// Delete a task
export async function deleteTask(pool, id, res) {
  try {
    await pool.query("DELETE FROM task WHERE id = ?", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
}

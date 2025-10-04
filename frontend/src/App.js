import "./App.css";
import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [animating, setAnimating] = useState({}); // { id: "complete" | "delete" }

  // Function to fetch latest 5 tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTodos(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch tasks on initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!title || !desc) return; // prevent empty todos

    try {
      const res = await fetch("http://localhost:4000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc }), // send to backend
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to add task");
        return;
      }

      const newTodo = await res.json();

      // Add the new todo to the top and keep only 5 tasks
      setTodos([newTodo, ...todos.slice(0, 4)]);

      setTitle("");
      setDesc("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding the task.");
    }
  };

  const triggerAnimationAndRemove = (id, type) => {
    // Mark this todo as animating
    setAnimating((prev) => ({ ...prev, [id]: type }));

    // Remove after animation duration
    setTimeout(() => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      setAnimating((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }, 600); // match CSS animation duration
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to delete task");
        return;
      }

      // Trigger animation
      triggerAnimationAndRemove(id, "delete");

      // After animation, refetch latest 5 tasks
      setTimeout(fetchTasks, 600);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting the task.");
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to complete task");
        return;
      }

      triggerAnimationAndRemove(id, "complete");
      setTimeout(fetchTasks, 600); // get next tasks
    } catch (err) {
      console.error(err);
      alert("Something went wrong while completing the task.");
    }
  };

  return (
    <div className="App">
      <h1> My ToDos</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              placeholder="What's the title of your To Do?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              placeholder="What's the description of your To Do?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="todo-input-item">
            <button type="button" className="addBtn" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>

        <div className="todo-list">
          {todos.slice(0, 5).map((todo) => (
            <div
              key={todo.id}
              className={`todo-list-item ${
                animating[todo.id] === "complete"
                  ? "completed-animate"
                  : animating[todo.id] === "delete"
                  ? "delete-animate"
                  : ""
              }`}
            >
              <div>
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
              </div>

              <div>
                <AiOutlineDelete
                  className="icon"
                  onClick={() => handleDelete(todo.id)}
                />
                <FaCheck
                  className="check-icon"
                  onClick={() => handleComplete(todo.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

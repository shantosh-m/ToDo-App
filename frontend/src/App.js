import "./App.css";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [animating, setAnimating] = useState({}); // { id: "complete" | "delete" }

  const handleAdd = () => {
    if (!title || !desc) return; // prevent empty todos
    const newTodo = {
      id: Date.now(),
      title,
      desc,
    };
    setTodos([newTodo, ...todos]); // add to top
    setTitle("");
    setDesc("");
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

  const handleDelete = (id) => {
    triggerAnimationAndRemove(id, "delete");
  };

  const handleComplete = (id) => {
    triggerAnimationAndRemove(id, "complete");
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
                <p>{todo.desc}</p>
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

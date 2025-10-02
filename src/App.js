import "./App.css";

function App() {
  return (
    <div className="App">
      <h1> My ToDos</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div>
            <div className="todo-input-item">
              <label>Title</label>
              <input type="text" placeholder="What's the task title" />
            </div>

            <div className="todo-input-item">
              <label>Description</label>
              <input type="text" placeholder="What's the task description" />
            </div>

            <div className="todo-input-item">
              <button type="button" className="addBtn">
                Add
              </button>
            </div>

            <div className="todo-list">
              <div className="todo">
                <h3>Task 1</h3>
                <p>Description</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

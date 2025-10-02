import "./App.css";

function App() {
  return (
    <div className="App">
      <h1> My ToDos</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input type="text" placeholder="What's the title of your To Do?" />
          </div>

          <div className="todo-input-item">
            <label>Description</label>
            <input type="text" placeholder="What's the description of your To Do?" />
          </div>

          <div className="todo-input-item">
            <button type="button" className="addBtn">
              Add
            </button>
          </div>
        </div>
        
        <div className="todo-list">
          <div className="todo-list-item">
            <h3>Task 1</h3>
            <p>Description</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;

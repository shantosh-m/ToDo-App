import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, title: "Test Task 1", description: "Desc 1" },
          { id: 2, title: "Test Task 2", description: "Desc 2" },
        ]),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders inputs and add button", () => {
  render(<App />);
  expect(
    screen.getByPlaceholderText(/title of your To Do/i)
  ).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText(/description of your To Do/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/add/i)).toBeInTheDocument();
});

test("fetches and displays tasks on load", async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });
});

test("adds a new task", async () => {
  render(<App />);
  const titleInput = screen.getByPlaceholderText(/title of your To Do/i);
  const descInput = screen.getByPlaceholderText(/description of your To Do/i);
  const addButton = screen.getByText(/add/i);

  fireEvent.change(titleInput, { target: { value: "New Task" } });
  fireEvent.change(descInput, { target: { value: "New Desc" } });

  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({ id: 3, title: "New Task", description: "New Desc" }),
    })
  );

  fireEvent.click(addButton);

  await waitFor(() => {
    expect(screen.getByText("New Task")).toBeInTheDocument();
    expect(screen.getByText("New Desc")).toBeInTheDocument();
  });
});

test("deletes a task", async () => {
  const { container } = render(<App />);
  await waitFor(() => screen.getByText("Test Task 1"));

  fetch.mockImplementationOnce(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  );

  const deleteButtons = container.querySelectorAll(".icon"); // delete buttons
  fireEvent.click(deleteButtons[0]);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith("http://localhost:4000/api/tasks/1", {
      method: "DELETE",
    });
  });
});

test("completes a task", async () => {
  const { container } = render(<App />);
  await waitFor(() => screen.getByText("Test Task 1"));

  fetch.mockImplementationOnce(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  );

  const checkButtons = container.querySelectorAll(".check-icon"); // complete buttons
  fireEvent.click(checkButtons[0]);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith("http://localhost:4000/api/tasks/1", {
      method: "DELETE",
    });
  });
});

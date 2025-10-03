import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setup from "../DataBase/dbSetup.js";
import router from "./routes/tasks.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

let pool;

// Initialize database and table
setup().then((p) => {
  pool = p;

  // pass pool to router
  app.use("/api/tasks", router(pool));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

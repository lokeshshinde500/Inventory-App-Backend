import express from "express";
import cors from "cors";

import constant from "./config/constant.js";
import indexRoutes from "./routes/indexRoutes.js";
import db from "./config/db.js";

const app = express();
const port = constant.PORT;

// for cors all origin
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create server
app.listen(port, async (error) => {
  if (error) {
    console.error("Server is not connected!", error);
    return;
  }
  console.log(`Server running on Port ${port}`);
  await db();
});

// Routes
app.use("/api", indexRoutes);

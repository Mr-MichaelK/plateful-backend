import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // nour: import cookie parser

import { connectToDb } from "./db.js";
// nour: auth routes for signup and login
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// allow credentials (cookies) from our frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

connectToDb()
  .then(() => {
    console.log("DB ready");

    app.get("/", (req, res) => {
      res.json({ message: "Plateful backend is running" });
    });

    // nour: mount auth endpoints: POST /signup and POST /login
    app.use(authRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });

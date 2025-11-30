// backend/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes.js"; // /api routes
import authRouter from "./auth/authRoutes.js"; // /auth routes
import { connectToDb } from "./db.js";
import path from "path";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your Vite frontend
    credentials: true, // allow cookies for auth
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------- STATIC UPLOADS ----------------------
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// ---------------------- CONNECT TO DATABASE ----------------------
await connectToDb();

// ---------------------- AUTH ROUTES ----------------------
// FIX NOTE: Frontend must call http://localhost:5001/auth/login, /auth/signup, /auth/check
app.use("/api/auth", authRouter);

// ---------------------- API ROUTES ----------------------
app.use("/api", router);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});

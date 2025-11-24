// server.js 
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import connectDB from "./db.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(cookieParser());

// Allow frontend access
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ---------- STATIC FILES ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve images from /uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ---------- DATABASE CONNECTION ----------
let cachedDb = null;

app.use(async (req, res, next) => {
  try {
    if (!cachedDb) {
      cachedDb = await connectDB();
      console.log("MongoDB connected successfully");
    }
    req.db = cachedDb;
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ error: "Database connection error" });
  }
});


// ---------- ROUTES ----------
app.use("/api/recipes", recipeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});


// ---------- START SERVER ----------
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
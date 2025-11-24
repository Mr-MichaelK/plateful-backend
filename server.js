// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./db.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); 

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded images (e.g. /uploads/berry-cobbler.jpg)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Attach Mongo DB instance to every request (singleton)
let cachedDb = null;

app.use(async (req, res, next) => {
  try {
    if (!cachedDb) {
      cachedDb = await connectDB();
      console.log("MongoDB connected Successfully");
    }
    req.db = cachedDb;
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ error: "Database connection error" });
  }
});

// Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/favorites", favoriteRoutes);

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
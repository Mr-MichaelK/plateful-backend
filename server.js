// backend/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes.js";
import authRouter from "./auth/authRoutes.js";
import { connectToDb } from "./db.js";
import path from "path";
import { swaggerUi, swaggerSpec } from "./swagger.js";

const app = express();

// ---------------------- CORS CONFIG ----------------------

const allowedOrigins = [
  "https://plateful-three.vercel.app",
  "http://localhost:5173",
   "http://localhost:5001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Render requires this for cookies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ---------------------- MIDDLEWARE ----------------------

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------- SWAGGER ----------------------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ---------------------- STATIC UPLOADS ----------------------
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// ---------------------- CONNECT TO DB ----------------------
await connectToDb();

// ---------------------- AUTH ROUTES ----------------------
app.use("/api/auth", authRouter);

// ---------------------- MAIN API ROUTES ----------------------
app.use("/api", router);

// ---------------------- START SERVER ----------------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

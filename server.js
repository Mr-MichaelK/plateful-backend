import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes.js";
import authRouter from "./auth/authRoutes.js";
import { connectToDb } from "./db.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

await connectToDb();

// Auth endpoints
app.use("", authRouter);

// API endpoints
app.use("/api", router);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});

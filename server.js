// backend/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes.js";          // all API routes (recipes, favorites, comments, upload)
import authRouter from "./auth/authRoutes.js";
import { connectToDb } from "./db.js";
import path from "path";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());


app.use(
  "/uploads",
  express.static(path.join(path.resolve(), "uploads"))
);

await connectToDb();

app.use("", authRouter);


app.use("/api", router);


app.listen(5001, () => {
  console.log("Server running on port 5001");
});
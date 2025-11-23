import express from "express";
import connectDB from "./db.js"; // the file you just made

const app = express();
app.use(express.json());

let db;
connectDB().then((database) => {
  db = database; // now your routes can use `db.collection("users")` etc.
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

import express from "express";
import bcrypt from "bcryptjs";
import { getDb } from "../db.js";

// made by nour diab

const router = express.Router();

// signup: create a new user in mongodb
router.post("/signup", async (req, res) => {
  try {
    const db = getDb();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    // backend password rule (same as frontend)
    if (password.length < 12) {
      return res
        .status(400)
        .json({ error: "Password must be at least 12 characters long." });
    }

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // hash password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created",
      userId: result.insertedId,
      name,
      email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// login: check email + password against stored hash
router.post("/login", async (req, res) => {
  try {
    const db = getDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // compare plain password to hashed password in db
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

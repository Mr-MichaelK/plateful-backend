// backend/auth/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../db.js";
import { ObjectId } from "mongodb"; // 🌟 FIX 1: Import ObjectId

const router = express.Router();

// jwt secret from .env
const JWT_SECRET = process.env.JWT_SECRET;
// 30 days in milliseconds for cookie expiry
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// helper to create jwt token (valid for 30 days)
function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

// helper to get token from cookie or auth header
function getTokenFromRequest(req) {
  // try http-only cookie first
  if (req.cookies && req.cookies.auth_token) {
    return req.cookies.auth_token;
  }

  // fallback: bearer token from authorization header
  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

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

    if (password.length < 12) {
      return res
        .status(400)
        .json({ error: "Password must be at least 12 characters long." });
    }

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      aboutMe: "",
      profilePicUrl: null,
    });

    const newUser = {
      _id: result.insertedId,
      name,
      email,
      aboutMe: "",
      profilePicUrl: null,
    };

    const token = createToken(newUser);

    res
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: THIRTY_DAYS_MS,
      })
      .status(201)
      .json({
        message: "User created",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          aboutMe: newUser.aboutMe,
          profilePicUrl: newUser.profilePicUrl,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const db = getDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = createToken(user);

    res
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: THIRTY_DAYS_MS,
      })
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          aboutMe: user.aboutMe,
          profilePicUrl: user.profilePicUrl,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// logout
router.post("/logout", (req, res) => {
  res
    .clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .json({ message: "Logged out successfully" });
});

// check authentication status
router.get("/check", async (req, res) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = getDb();
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } } // Exclude the password field
    );

    if (!user) {
      return res.status(401).json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        aboutMe: user.aboutMe,
        profilePicUrl: user.profilePicUrl,
      },
    });
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ authenticated: false });
  }
});

export default router;

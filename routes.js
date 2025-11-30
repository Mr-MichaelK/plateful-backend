// routes.js
import express from "express";
import path from "path";
import multer from "multer";

import { attachDb } from "./db.js";
import { requireAuth } from "./auth/requireAuth.js";
import { subscribeNewsletter } from "./controllers/newsletterController.js";

import {
  getAllRecipes,
  getRecipeByTitle,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getFeaturedRecipes,
} from "./controllers/recipeController.js";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "./controllers/favoriteController.js";

import {
  addComment,
  getCommentsForRecipe,
} from "./controllers/commentController.js";

import {
  updateUserProfile,
  deleteUserProfile,
} from "./controllers/userController.js";

const router = express.Router();

// =====================================================
// FIXED — ABSOLUTE UPLOAD PATH (required for multer)
// Multer sometimes fails silently with relative paths,
// so path.resolve() is used to guarantee correct folder.
// =====================================================
const uploadPath = path.join(path.resolve(), "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + ext);
  },
});

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, PNG, WEBP images allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ---------------- ROUTES -----------------

router.get("/recipes", attachDb, getAllRecipes);
router.get("/recipes/featured", attachDb, getFeaturedRecipes);
router.get("/recipes/:title", attachDb, getRecipeByTitle);

router.get("/comments/:title", attachDb, getCommentsForRecipe);

// CREATE — must be logged in
router.post(
  "/recipes",
  attachDb,
  requireAuth,
  upload.array("images", 3),
  createRecipe
);

// UPDATE — owner-only
router.put(
  "/recipes/:title",
  attachDb,
  requireAuth,
  upload.array("images", 3),
  updateRecipe
);

// DELETE — owner-only
router.delete("/recipes/:title", attachDb, requireAuth, deleteRecipe);

// FAVORITES — per user
router.post("/favorites/:title", attachDb, requireAuth, addFavorite);
router.get("/favorites", attachDb, requireAuth, getFavorites);
router.delete("/favorites/:title", attachDb, requireAuth, removeFavorite);

// COMMENTS — must be logged in
router.post("/comments/:title", attachDb, requireAuth, addComment);

// Newsletter
router.post("/newsletter/subscribe", attachDb, subscribeNewsletter);

router.put(
  "/users/profile",
  attachDb,
  requireAuth,
  upload.single("profilePicture"),
  updateUserProfile
);

router.delete("/users/profile", requireAuth, deleteUserProfile);

export default router;

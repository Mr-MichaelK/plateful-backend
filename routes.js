// routes.js
import express from "express";
import path from "path";
import multer from "multer";

import { attachDb } from "./db.js";
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

const router = express.Router();

/* -----------------------------------------
   MULTER STORAGE FOR RECIPE IMAGES
----------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // folder already exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg / .png / .webp
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/* --------------------
   RECIPE ROUTES
--------------------- */
router.get("/recipes", attachDb, getAllRecipes);
router.get("/recipes/featured", attachDb, getFeaturedRecipes);
router.get("/recipes/:title", attachDb, getRecipeByTitle);

// IMPORTANT: images + text together (Option A)
router.post("/recipes", attachDb, upload.array("images", 3), createRecipe);
router.put("/recipes/:title", attachDb, upload.array("images", 3), updateRecipe);
router.delete("/recipes/:title", attachDb, deleteRecipe);

/* --------------------
   FAVORITE ROUTES
--------------------- */
router.post("/favorites/:title", attachDb, addFavorite);
router.get("/favorites", attachDb, getFavorites);
router.delete("/favorites/:title", attachDb, removeFavorite);

/* --------------------
   COMMENT ROUTES
--------------------- */
router.post("/comments/:title", attachDb, addComment);
router.get("/comments/:title", attachDb, getCommentsForRecipe);

/* --------------------
   NEWSLETTER
--------------------- */
router.post("/newsletter/subscribe", attachDb, subscribeNewsletter);

export default router;
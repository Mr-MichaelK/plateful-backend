// routes.js
import express from "express";
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
  removeFavorite
} from "./controllers/favoriteController.js";

import {
  addComment,
  getCommentsForRecipe
} from "./controllers/commentController.js";

const router = express.Router();

/* --------------------
   Recipe Routes
--------------------- */
router.get("/recipes", attachDb, getAllRecipes);
router.get("/recipes/featured", attachDb, getFeaturedRecipes);
router.get("/recipes/:title", attachDb, getRecipeByTitle);
router.post("/recipes", attachDb, createRecipe);
router.put("/recipes/:title", attachDb, updateRecipe);
router.delete("/recipes/:title", attachDb, deleteRecipe);

/* --------------------
   Favorite Routes
--------------------- */
router.post("/favorites/:title", attachDb, addFavorite);
router.get("/favorites", attachDb, getFavorites);
router.delete("/favorites/:title", attachDb, removeFavorite);

/* --------------------
   Comment Routes
--------------------- */
router.post("/comments/:title", attachDb, addComment);
router.get("/comments/:title", attachDb, getCommentsForRecipe);


router.post("/newsletter/subscribe", attachDb, subscribeNewsletter);
export default router;

// routes/recipeRoutes.js
import express from "express";
import {
  getAllRecipes,
  getRecipeByTitle,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";

const router = express.Router();

// GET all recipes
router.get("/", getAllRecipes);

// GET one by title
router.get("/:title", getRecipeByTitle);

// CREATE
router.post("/", createRecipe);

// UPDATE
router.put("/:title", updateRecipe);

// DELETE
router.delete("/:title", deleteRecipe);

export default router;
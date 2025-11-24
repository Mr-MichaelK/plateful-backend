// routes/commentRoutes.js
import express from "express";
import {
  addComment,
  getCommentsForRecipe,
} from "../controllers/commentController.js";

const router = express.Router();

// GET all comments for a specific recipe
router.get("/:title", getCommentsForRecipe);

// POST a new comment for a specific recipe
router.post("/:title", addComment);

export default router;
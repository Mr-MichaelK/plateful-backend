// routes/favoriteRoutes.js
import express from "express";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/:title", addFavorite);
router.get("/", getFavorites);
router.delete("/:title", removeFavorite);

export default router;
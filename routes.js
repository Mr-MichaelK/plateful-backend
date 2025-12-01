/**
 * @swagger
 * tags:
 *   - name: Recipes
 *     description: Manage recipes
 *   - name: Favorites
 *     description: Manage user favorite recipes
 *   - name: Comments
 *     description: Manage comments on recipes
 *   - name: Users
 *     description: User profile and settings
 *   - name: Newsletter
 *     description: Newsletter subscriptions
 *   - name: MealPlans
 *     description: Weekly meal planning
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     tags: [Recipes]
 *     summary: Get all recipes
 *     responses:
 *       200:
 *         description: List of recipes
 *       500:
 *         description: Failed to fetch recipes
 */

/**
 * @swagger
 * /recipes/featured:
 *   get:
 *     tags: [Recipes]
 *     summary: Get featured recipes
 *     responses:
 *       200:
 *         description: Featured recipes
 *       500:
 *         description: Failed to fetch featured recipes
 */

/**
 * @swagger
 * /recipes/{title}:
 *   get:
 *     tags: [Recipes]
 *     summary: Get recipe by title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe found
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Failed to fetch recipe
 */


/**
 * @swagger
 * /comments/{title}:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments for a recipe
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe comments retrieved successfully
 *       500:
 *         description: Failed to get comments
 */


/**
 * @swagger
 * /recipes:
 *   post:
 *     tags: [Recipes]
 *     summary: Create a new recipe (requires login)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               ingredients:
 *                 type: string
 *                 description: JSON array
 *               steps:
 *                 type: string
 *                 description: JSON array
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Recipe created
 *       400:
 *         description: At least 1 image required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create recipe
 */

/**
 * @swagger
 * /recipes/{title}:
 *   put:
 *     tags: [Recipes]
 *     summary: Update recipe
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               ingredients:
 *                 type: string
 *                 description: JSON array
 *               steps:
 *                 type: string
 *                 description: JSON array
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Recipe updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not allowed (not owner)
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Failed to update recipe
 */

/**
 * @swagger
 * /recipes/{title}:
 *   delete:
 *     tags: [Recipes]
 *     summary: Delete recipe
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not allowed (not owner)
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Failed to delete recipe
 */

/**
 * @swagger
 * /favorites/{title}:
 *   post:
 *     tags: [Favorites]
 *     summary: Add a favorite
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite added
 *       401:
 *         description: Unauthorized (user not logged in)
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Failed to add favorite
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Get all favorites
 *     responses:
 *       200:
 *         description: List of favorites
 *       401:
 *         description: Unauthorized (user not logged in)
 *       500:
 *         description: Failed to fetch favorites
 */

/**
 * @swagger
 * /favorites/{title}:
 *   delete:
 *     tags: [Favorites]
 *     summary: Remove favorite
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite removed
 *       401:
 *         description: Unauthorized (user not logged in)
 *       500:
 *         description: Failed to remove favorite
 */


/**
 * @swagger
 * /comments/{title}:
 *   post:
 *     tags: [Comments]
 *     summary: Add a comment to a recipe (requires login)
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: Optional rating for the recipe
 *               comment:
 *                 type: string
 *                 description: Optional comment text
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       400:
 *         description: Rating or comment is required
 *       500:
 *         description: Failed to add comment
 *       401:
 *         description: Unauthorized (user must be logged in)
 */


/**
 * @swagger
 * /newsletter/subscribe:
 *   post:
 *     tags: [Newsletter]
 *     summary: Subscribe to newsletter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscribed successfully
 *       400:
 *         description: Email is required or email already subscribed
 *       500:
 *         description: Subscription failed due to server error
 */


/**
* @swagger
 * /users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               aboutMe:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: "Profile updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     aboutMe:
 *                       type: string
 *                     profilePicUrl:
 *                       type: string
 *       400:
 *         description: "No fields to update"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: "Unauthorized - User not logged in"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: "User not found"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       409:
 *         description: "Email already taken"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: "Internal server error during profile update"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


/**
 * @swagger
 * /users/profile:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user profile
 *     responses:
 *       200:
 *         description: "Account deleted successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: "Unauthorized: User not logged in"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: "User not found"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: "Internal server error during account deletion"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /users/password:
 *   put:
 *     tags: [Users]
 *     summary: Update user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password successfully changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Both current and new passwords required / New password too short
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Current password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error during password update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /meal-plans/{weekStartDate}:
 *   get:
 *     tags: [MealPlans]
 *     summary: Get weekly meal plan
 *     parameters:
 *       - in: path
 *         name: weekStartDate
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Meal plan retrieved"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meals:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           nullable: true
 *                         name:
 *                           type: string
 *                         imageUrl:
 *                           type: string
 *                           nullable: true
 *       500:
 *         description: "Failed to fetch meal plan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /meal-plans:
 *   put:
 *     tags: [MealPlans]
 *     summary: Create/update meal plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateString:
 *                 type: string
 *               meals:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *     responses:
 *       200:
 *         description: "Meal plan saved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 modifiedCount:
 *                   type: integer
 *                 upsertedCount:
 *                   type: integer
 *       400:
 *         description: "Missing dateString or meals data"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: "Failed to save meal plan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


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
  updatePassword,
} from "./controllers/userController.js";

import { getMealPlan, saveMealPlan } from "./controllers/mealPlanController.js";

const router = express.Router();

// Storage config for multer
const uploadPath = path.join(path.resolve(), "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + ext);
  },
});

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, PNG, WEBP allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/recipes", attachDb, getAllRecipes);

router.get("/recipes/featured", attachDb, getFeaturedRecipes);

router.get("/recipes/:title", attachDb, getRecipeByTitle);

router.get("/comments/:title", attachDb, getCommentsForRecipe);

router.post(
  "/recipes",
  attachDb,
  requireAuth,
  upload.array("images", 3),
  createRecipe
);

router.put(
  "/recipes/:title",
  attachDb,
  requireAuth,
  upload.array("images", 3),
  updateRecipe
);

router.delete("/recipes/:title", attachDb, requireAuth, deleteRecipe);

router.post("/favorites/:title", attachDb, requireAuth, addFavorite);

router.get("/favorites", attachDb, requireAuth, getFavorites);

router.delete("/favorites/:title", attachDb, requireAuth, removeFavorite);

router.post("/comments/:title", attachDb, requireAuth, addComment);

router.post("/newsletter/subscribe", attachDb, subscribeNewsletter);

router.put(
  "/users/profile",
  attachDb,
  requireAuth,
  upload.single("profilePicture"),
  updateUserProfile
);

router.delete("/users/profile", requireAuth, deleteUserProfile);

router.put("/users/password", requireAuth, updatePassword);

router.get("/meal-plans/:weekStartDate", attachDb, requireAuth, getMealPlan);

router.put("/meal-plans", attachDb, requireAuth, saveMealPlan);

export default router;

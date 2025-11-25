// controllers/recipeController.js
import nodemailer from "nodemailer";

/* -------------------------------------------------------
   GET ALL RECIPES
------------------------------------------------------- */
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await req.db.collection("recipes").find().toArray();

    const normalized = recipes.map((r) => ({
      ...r,
      images: r.images || [],
      extraImages: r.extraImages || r.images?.slice(1) || [],
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

/* -------------------------------------------------------
   GET RECIPE BY TITLE
------------------------------------------------------- */
export const getRecipeByTitle = async (req, res) => {
  try {
    const decodedTitle = decodeURIComponent(req.params.title);

    const recipe = await req.db
      .collection("recipes")
      .findOne({ title: decodedTitle });

    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    recipe.images = recipe.images || [];
    recipe.extraImages = recipe.extraImages || recipe.images.slice(1);

    res.json(recipe);
  } catch (err) {
    console.error("Failed to fetch recipe:", err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

/* -------------------------------------------------------
   CREATE RECIPE (multer already saved files)
------------------------------------------------------- */
export const createRecipe = async (req, res) => {
  try {
    const { title, description, category, whyLove } = req.body;

    // arrays are sent as JSON strings from frontend
    const ingredients = JSON.parse(req.body.ingredients || "[]");
    const steps = JSON.parse(req.body.steps || "[]");

    const imagePaths = (req.files || []).map(
      (file) => `/uploads/${file.filename}`
    );

    if (imagePaths.length === 0) {
      return res.status(400).json({ error: "Please upload at least 1 image" });
    }

    const newRecipe = {
      title,
      description,
      category,
      whyLove: whyLove || "",
      image: imagePaths[0], // main image
      images: imagePaths,
      extraImages: imagePaths.slice(1),
      ingredients,
      steps,
    };

    const result = await req.db.collection("recipes").insertOne(newRecipe);

    // optional: newsletter emails
    sendRecipeNotification(req.db, newRecipe);

    res.json({ message: "Recipe created", id: result.insertedId });
  } catch (err) {
    console.error("Failed to create recipe:", err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

/* -------------------------------------------------------
   SEND NOTIFICATION EMAILS
------------------------------------------------------- */
const sendRecipeNotification = async (db, recipe) => {
  try {
    const subscribers = await db.collection("newsletter").find().toArray();
    const emails = subscribers.map((sub) => sub.email);

    if (emails.length === 0) return;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Plateful" <${process.env.SMTP_USER}>`,
      to: emails,
      subject: `New Recipe: ${recipe.title}`,
      html: `
        <h2>New Recipe Alert!</h2>
        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>
      `,
    });

    console.log("Newsletter notifications sent");
  } catch (err) {
    console.error("Failed to send recipe notifications:", err);
  }
};

/* -------------------------------------------------------
   UPDATE RECIPE
   - text (title, desc, etc.) always updated
   - images updated ONLY if new files were uploaded
------------------------------------------------------- */
export const updateRecipe = async (req, res) => {
  try {
    const decodedTitle = decodeURIComponent(req.params.title);

    const { title, description, category, whyLove } = req.body;

    const ingredients = JSON.parse(req.body.ingredients || "[]");
    const steps = JSON.parse(req.body.steps || "[]");

    const newImages = (req.files || []).map(
      (file) => `/uploads/${file.filename}`
    );

    const updateDoc = {
      title,
      description,
      category,
      whyLove: whyLove || "",
      ingredients,
      steps,
    };

    // Only overwrite images if user uploaded new ones
    if (newImages.length > 0) {
      updateDoc.image = newImages[0];
      updateDoc.images = newImages;
      updateDoc.extraImages = newImages.slice(1);
    }

    await req.db
      .collection("recipes")
      .updateOne({ title: decodedTitle }, { $set: updateDoc });

    res.json({ message: "Recipe updated" });
  } catch (err) {
    console.error("Failed to update recipe:", err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
};

/* -------------------------------------------------------
   DELETE RECIPE
------------------------------------------------------- */
export const deleteRecipe = async (req, res) => {
  try {
    const decodedTitle = decodeURIComponent(req.params.title);
    await req.db.collection("recipes").deleteOne({ title: decodedTitle });
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error("Failed to delete recipe:", err);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};

/* -------------------------------------------------------
   FEATURED RECIPES
------------------------------------------------------- */
export const getFeaturedRecipes = async (req, res) => {
  try {
    const recipes = await req.db.collection("recipes").find().toArray();

    const normalized = recipes.map((r) => ({
      ...r,
      images: r.images || [],
      extraImages: r.extraImages || (r.images?.slice(1) || []),
    }));

    const day = new Date().getDate();
    const startIndex = day % normalized.length;

    const featured = [];
    for (let i = 0; i < 4; i++) {
      featured.push(normalized[(startIndex + i) % normalized.length]);
    }

    res.json(featured);
  } catch (err) {
    console.error("Failed to fetch featured recipes:", err);
    res.status(500).json({ error: "Failed to fetch featured recipes" });
  }
};
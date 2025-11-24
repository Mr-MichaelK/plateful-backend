import nodemailer from "nodemailer";

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await req.db.collection("recipes").find().toArray();

    // Normalize ALL recipes inside the array
    const normalized = recipes.map((r) => ({
      ...r,
      images: r.images || r.extraImages || [],
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

export const getRecipeByTitle = async (req, res) => {
  try {
    const decodedTitle = decodeURIComponent(req.params.title);

    const recipe = await req.db
      .collection("recipes")
      .findOne({ title: decodedTitle });

    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    // Always return "images"
    recipe.images = recipe.images || recipe.extraImages || [];
    delete recipe.extraImages;

    res.json(recipe);
  } catch (err) {
    console.error("Failed to fetch recipe:", err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.description || !data.category) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newRecipe = {
      title: data.title,
      description: data.description,
      category: data.category,
      image: data.image,       // main image
      images: data.images || [], // array of images
      whyLove: data.whyLove || "",
      ingredients: data.ingredients || [],
      steps: data.steps || [],
    };

    const result = await req.db.collection("recipes").insertOne(newRecipe);

    // Send notification to newsletter subscribers
    sendRecipeNotification(req.db, newRecipe);

    res.json({ message: "Recipe created", id: result.insertedId });
  } catch (err) {
    console.error("Failed to create recipe:", err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

// Helper function to send notification emails
const sendRecipeNotification = async (db, recipe) => {
  try {
    const subscribers = await db.collection("newsletter").find().toArray();
    const emails = subscribers.map(sub => sub.email);

    if (emails.length === 0) return;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Recipe App" <${process.env.SMTP_USER}>`,
      to: emails, // can be comma-separated or array
      subject: `New Recipe: ${recipe.title}`,
      text: `Check out our new recipe: ${recipe.title}!\n\n${recipe.description}`,
      html: `<h1>New Recipe Alert!</h1>
             <h2>${recipe.title}</h2>
             <p>${recipe.description}</p>
             <p>Check it out now on our website!</p>`,
    });

    console.log("Newsletter notifications sent!");
  } catch (err) {
    console.error("Failed to send recipe notifications:", err);
  }
};


export const updateRecipe = async (req, res) => {
  try {
    const decodedTitle = decodeURIComponent(req.params.title);
    const data = req.body;

    const updatedRecipe = {
      title: data.title,
      description: data.description,
      category: data.category,
      image: data.image,
      images: data.images || [],
      whyLove: data.whyLove || "",
      ingredients: data.ingredients || [],
      steps: data.steps || [],
    };

    await req.db
      .collection("recipes")
      .updateOne({ title: decodedTitle }, { $set: updatedRecipe });

    res.json({ message: "Recipe updated" });
  } catch (err) {
    console.error("Failed to update recipe:", err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
};

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

// Returns 4 featured recipes (randomly, could change every day)
export const getFeaturedRecipes = async (req, res) => {
  try {
    const recipes = await req.db.collection("recipes").find().toArray();

    // Normalize images
    const normalized = recipes.map((r) => ({
      ...r,
      images: r.images || r.extraImages || [],
    }));

    // Daily rotation using date
  
    const day = new Date().getDate(); // 1-31
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


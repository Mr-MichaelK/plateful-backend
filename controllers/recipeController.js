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
    res.json({ message: "Recipe created", id: result.insertedId });
  } catch (err) {
    console.error("Failed to create recipe:", err);
    res.status(500).json({ error: "Failed to create recipe" });
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

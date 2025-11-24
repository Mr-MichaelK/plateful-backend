// controllers/favoriteController.js
export const addFavorite = async (req, res) => {
  try {
    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title);

    const recipe = await req.db
      .collection("recipes")
      .findOne({ title: decodedTitle });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Insert ONLY the title — we fetch full recipe info in the frontend
    await req.db.collection("favorites").updateOne(
      { title: decodedTitle },
      { $set: { title: decodedTitle } },
      { upsert: true }
    );

    res.json({ message: "Added to favorites" });
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await req.db.collection("favorites").find().toArray();
    res.json(favorites);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title);

    await req.db.collection("favorites").deleteOne({ title: decodedTitle });

    res.json({ message: "Favorite removed" });
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};
import { ObjectId } from "mongodb";

function getStartOfWeek(dateString) {
  const date = new Date(dateString);
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

const INITIAL_MEAL_DATA = [
  Array(7).fill({ id: null, name: "-", imageUrl: null }),
  Array(7).fill({ id: null, name: "-", imageUrl: null }),
  Array(7).fill({ id: null, name: "-", imageUrl: null }),
];

export async function getMealPlan(req, res) {
  try {
    const db = req.db;
    const userId = req.user.id;
    const dateString = req.params.weekStartDate;

    const weekStartDate = getStartOfWeek(dateString);

    const mealPlan = await db.collection("mealPlans").findOne({
      userId: new ObjectId(userId),
      weekStartDate: weekStartDate,
    });

    if (mealPlan) {
      return res.json({ meals: mealPlan.meals });
    } else {
      return res.json({ meals: INITIAL_MEAL_DATA });
    }
  } catch (err) {
    console.error("Failed to fetch meal plan:", err);
    res.status(500).json({ error: "Failed to fetch meal plan" });
  }
}

export async function saveMealPlan(req, res) {
  try {
    const db = req.db;
    const userId = req.user.id;

    const { dateString, meals } = req.body;

    if (!dateString || !meals) {
      return res
        .status(400)
        .json({ error: "Missing dateString or meals data." });
    }

    const weekStartDate = getStartOfWeek(dateString);

    const planDocument = {
      userId: new ObjectId(userId),
      weekStartDate: weekStartDate,
      meals: meals,
      updatedAt: new Date(),
    };

    const result = await db.collection("mealPlans").updateOne(
      {
        userId: new ObjectId(userId),
        weekStartDate: weekStartDate,
      },
      {
        $set: planDocument,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    res.json({
      message: "Meal plan saved successfully",
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });
  } catch (err) {
    console.error("Failed to save meal plan:", err);
    res.status(500).json({ error: "Failed to save meal plan" });
  }
}

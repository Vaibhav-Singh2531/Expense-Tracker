import { db } from "../lib/prisma.js";

export const getCurrentBudget = async (req, res) => {
  try {
    const { accountId } = req.query; // could be passed as query param
    const userId = req.auth?.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const budget = await db.budget.findUnique({
      where: {
        userId: user.id,
      },
    });

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        ...(accountId ? { accountId } : {}),
      },
      _sum: {
        amount: true,
      },
    });

    return res.json({
      budget: budget ? { ...budget, amount: Number(budget.amount) } : null,
      currentExpenses: expenses._sum.amount ? Number(expenses._sum.amount) : 0,
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.auth?.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const budget = await db.budget.upsert({
      where: {
        userId: user.id,
      },
      update: {
        amount,
      },
      create: {
        userId: user.id,
        amount,
      },
    });

    return res.json({
      success: true,
      data: { ...budget, amount: Number(budget.amount) },
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

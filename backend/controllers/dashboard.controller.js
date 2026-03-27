import { db } from "../lib/prisma.js";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = Number(obj.balance);
  }
  if (obj.amount) {
    serialized.amount = Number(obj.amount);
  }
  return serialized;
};

export const getUserAccounts = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return res.json({ success: true, data: accounts.map(serializeTransaction) });
  } catch (error) {
    console.error("Error in getUserAccounts:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const data = req.body;

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      return res.status(400).json({ error: "Invalid balance amount" });
    }

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    return res.json({ success: true, data: serializeTransaction(account) });
  } catch (error) {
    console.error("Error in createAccount:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    return res.json({ success: true, data: transactions.map(serializeTransaction) });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    return res.status(500).json({ error: error.message });
  }
};

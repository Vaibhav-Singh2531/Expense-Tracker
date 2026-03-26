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

const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = Number(obj.balance);
  }
  if (obj.amount) {
    serialized.amount = Number(obj.amount);
  }
  return serialized;
};

export const updateDefaultAccount = async (req, res) => {
  try {
    const { accountId } = req.body;
    const userId = req.auth?.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await db.account.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: { isDefault: true },
    });

    return res.json({ success: true, data: serializeTransaction(account) });
  } catch (error) {
    console.error("Error in updateDefaultAccount:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAccountWithTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.auth?.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const account = await db.account.findUnique({
      where: {
        id: accountId,
        userId: user.id,
      },
      include: {
        transactions: {
          orderBy: { date: "desc" },
        },
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!account) return res.status(404).json({ error: "Account not found" });

    return res.json({
      ...serializeDecimal(account),
      transactions: account.transactions.map(serializeDecimal),
    });
  } catch (error) {
    console.error("Error in getAccountWithTransactions:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const bulkDeleteTransactions = async (req, res) => {
  try {
    const { transactionIds } = req.body;
    const userId = req.auth?.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      const change =
        transaction.type === "EXPENSE"
          ? transaction.amount
          : -transaction.amount;
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });

      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges
      )) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Error in bulkDeleteTransactions:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

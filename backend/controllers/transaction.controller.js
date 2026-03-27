import { db } from "../lib/prisma.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function calculateNextRecurringDate(startDate, interval) {
    const date = new Date(startDate);
    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }
    return date;
}

const serializeAmount = (obj) => ({
    ...obj,
    amount: Number(obj.amount),
});

export const createTransaction = async (req, res) => {
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

        const account = await db.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id,
            },
        });

        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }

        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
        const newBalance = account.balance.toNumber() + balanceChange;

        const transaction = await db.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(data.date, data.recurringInterval)
                            : null,
                },
            });

            await tx.account.update({
                where: { id: data.accountId },
                data: { balance: newBalance },
            });

            return newTransaction;
        });

        return res.json({ success: true, data: serializeAmount(transaction) });
    } catch (error) {
        console.error("Error in createTransaction:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const scanReceipt = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const base64String = req.file.buffer.toString("base64");

        const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,Food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64String,
                    mimeType: req.file.mimetype,
                },
            },
            prompt
        ]);

        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/\`\`\`(?:json)?\\n?/g, "").replace(/\`\`\`/g, "").trim();

        try {
            const data = JSON.parse(cleanedText);
            return res.json({
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                description: data.description,
                category: data.category,
                merchantName: data.merchantName,
            });
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError, "\\Text received:", cleanedText);
            return res.status(500).json({ error: "Invalid response format from Gemini" });
        }
    } catch (error) {
        console.error("Error scanning receipt:", error.message);
        return res.status(500).json({ error: "Failed to scan receipt" });
    }
};

export const getTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.auth?.userId;
        
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        const transaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        return res.json(serializeAmount(transaction));
    } catch (error) {
        console.error("Error in getTransaction:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const userId = req.auth?.userId;
        
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        const originalTransaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id,
            },
            include: {
                account: true,
            },
        });

        if (!originalTransaction) return res.status(404).json({ error: "Transaction not found" });

        const oldBalanceChange =
            originalTransaction.type === "EXPENSE"
                ? -originalTransaction.amount.toNumber()
                : originalTransaction.amount.toNumber();

        const newBalanceChange =
            data.type === "EXPENSE" ? -data.amount : data.amount;

        const netBalanceChange = newBalanceChange - oldBalanceChange;

        const transaction = await db.$transaction(async (tx) => {
            const updated = await tx.transaction.update({
                where: {
                    id,
                    userId: user.id,
                },
                data: {
                    ...data,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(data.date, data.recurringInterval)
                            : null,
                },
            });

            await tx.account.update({
                where: { id: data.accountId },
                data: {
                    balance: {
                        increment: netBalanceChange,
                    },
                },
            });

            return updated;
        });

        return res.json({ success: true, data: serializeAmount(transaction) });
    } catch (error) {
        console.error("Error in updateTransaction:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

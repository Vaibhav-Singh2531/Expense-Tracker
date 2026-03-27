import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ClerkExpressWithAuth, ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import aj from "./lib/arcjet.js";
import { checkUser } from "./lib/checkUser.js";
import accountRoutes from "./routes/account.route.js";
import budgetRoutes from "./routes/budget.route.js";
import transactionRoutes from "./routes/transaction.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Global Auth parsing (does not reject unauthenticated)
app.use(ClerkExpressWithAuth());

// Arcjet Rate Limiting Middleware
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      userId: req.auth?.userId || req.headers["x-forwarded-for"] || req.ip,
      requested: 1,
    });
    if (decision.isDenied()) {
      return res.status(429).json({ error: "Too Many Requests", reason: decision.reason });
    }
    next();
  } catch (error) {
    console.error("Arcjet error:", error);
    next(error);
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Protected route to sync user to database
app.post("/api/users/sync", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await checkUser(req.auth.userId);
    if (!user) {
      return res.status(400).json({ error: "Failed to sync user" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register API Routes
app.use("/api/accounts", accountRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/transactions", transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

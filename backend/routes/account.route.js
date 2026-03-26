import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  updateDefaultAccount,
  getAccountWithTransactions,
  bulkDeleteTransactions,
} from "../controllers/account.controller.js";

const router = express.Router();

// All account routes require authentication
router.use(ClerkExpressRequireAuth());

router.patch("/default", updateDefaultAccount);
router.get("/:accountId", getAccountWithTransactions);
router.post("/transactions/bulk-delete", bulkDeleteTransactions);

export default router;

import express from "express";
import { serve } from "inngest/express";
import { inngest } from "../lib/inngest/client.js";
import {
    checkBudgetAlert,
    triggerRecurringTransactions,
    processRecurringTransaction,
    generateMonthlyReports,
} from "../lib/inngest/function.js";

const router = express.Router();

router.use("/", serve({
    client: inngest,
    functions: [
        checkBudgetAlert,
        triggerRecurringTransactions,
        processRecurringTransaction,
        generateMonthlyReports,
    ],
}));

export default router;

import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  getCurrentBudget,
  updateBudget,
} from "../controllers/budget.controller.js";

const router = express.Router();

router.use(ClerkExpressRequireAuth());

router.get("/", getCurrentBudget);
router.put("/", updateBudget);

export default router;

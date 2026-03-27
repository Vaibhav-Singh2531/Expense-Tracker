import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  getUserAccounts,
  createAccount,
  getDashboardData,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.use(ClerkExpressRequireAuth());

router.get("/accounts", getUserAccounts);
router.post("/accounts", createAccount);
router.get("/", getDashboardData);

export default router;

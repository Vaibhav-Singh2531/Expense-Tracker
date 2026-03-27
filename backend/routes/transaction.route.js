import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import multer from "multer";
import {
    createTransaction,
    scanReceipt,
    getTransaction,
    updateTransaction,
} from "../controllers/transaction.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// All transaction routes require authentication
router.use(ClerkExpressRequireAuth());

router.post("/", createTransaction);
router.post("/scan-receipt", upload.single("file"), scanReceipt);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);

export default router;

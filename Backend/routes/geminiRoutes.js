import { Router } from "express";
import { geminiResult } from "../controllers/geminiController.js";
const router = Router();

router.get("/airesult", geminiResult);

export default router;

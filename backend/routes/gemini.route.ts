import { Router } from "express";
import { getResult } from "../controllers/gemini.controller";

const router = Router();

router.get('/get-result', getResult);

export default router;
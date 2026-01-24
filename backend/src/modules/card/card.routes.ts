import express from "express";
import { getCardById } from "./card.controller";

const router = express.Router();

router.get("/details", getCardById);

export default router;

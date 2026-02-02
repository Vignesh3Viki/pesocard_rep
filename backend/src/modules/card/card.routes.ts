import express from "express";
import { getCardById } from "./card.controller.js";

const router = express.Router();

router.get("/details", getCardById);

export default router;

import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import cardRoutes from "./modules/card/card.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/card", cardRoutes);
router.use("/analytics", analyticsRoutes);

export default router;


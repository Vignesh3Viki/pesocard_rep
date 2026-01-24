import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import cardRoutes from "./modules/card/card.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/card", cardRoutes);
router.use("/analytics", analyticsRoutes);

export default router;


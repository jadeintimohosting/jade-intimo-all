import { apiLimiter } from "#config/rateLimiter.js";
import { getLowStock, getOrderEvolution, getPendingOrders} from "#controllers/dashboard.controller.js";
import { adminRoute } from "#middleware/admin.middleware.js";
import { authenticateToken } from "#middleware/auth.middleware.js";
import express from "express";

const router=express.Router()

router.use(authenticateToken)
router.use(adminRoute)
router.use(apiLimiter(15*60*1000,200))

router.get("/order-evolution/:days",getOrderEvolution)
router.get("/low-stock",getLowStock)
router.get("/pending-orders",getPendingOrders)

export default router
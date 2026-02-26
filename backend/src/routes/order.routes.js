import express from "express";
import { placeOrderController, getOrdersController, checkStock, payOrder, getOrderDetails, getAdminOrders, getAdminOrder, updateAdminOrder } from "#controllers/order.controller.js";
import { authenticateToken } from "#middleware/auth.middleware.js";
import { adminRoute } from "#middleware/admin.middleware.js";
import { apiLimiter } from "#config/rateLimiter.js";

const router = express.Router();

//user
router.post("/place", apiLimiter(15 * 60 * 1000, 5), placeOrderController);
router.get("/get", apiLimiter(15 * 60 * 1000, 50), authenticateToken, getOrdersController);
router.post("/check_stock", apiLimiter(15 * 60 * 1000, 20), checkStock);
router.post("/payment", apiLimiter(15 * 60 * 1000, 10), payOrder);
router.get("/details/:id", apiLimiter(15 * 60 * 1000, 50), authenticateToken, getOrderDetails);


//admin
router.get("/admin", apiLimiter(15 * 60 * 1000, 200), authenticateToken, adminRoute, getAdminOrders);
router.route("/admin/:id")
    .get(apiLimiter(15 * 60 * 1000, 200), authenticateToken, adminRoute, getAdminOrder)
    .patch(apiLimiter(15 * 60 * 1000, 100), authenticateToken, adminRoute, updateAdminOrder);

export default router;
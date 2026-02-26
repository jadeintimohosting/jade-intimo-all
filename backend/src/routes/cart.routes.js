import express from "express"
import { getCart, addToCart, updateQuantity, removeItem, deleteCartController } from "#controllers/cart.controller.js"
import { authenticateToken } from "#middleware/auth.middleware.js"
import { apiLimiter } from "#config/rateLimiter.js" // Nu uita să adaugi importul!

const router = express.Router()

router.use(authenticateToken)

router.route("/")
    .get(apiLimiter(15 * 60 * 1000, 150), getCart)
    .post(apiLimiter(15 * 60 * 1000, 40), addToCart)
    .delete(apiLimiter(15 * 60 * 1000, 10), deleteCartController)

router.route("/:id")
    .patch(apiLimiter(15 * 60 * 1000, 80), updateQuantity)
    .delete(apiLimiter(15 * 60 * 1000, 30), removeItem)

export default router
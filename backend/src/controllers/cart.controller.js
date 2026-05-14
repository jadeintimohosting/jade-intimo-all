import logger from "#config/logger.js"
import { db } from "#config/database.js"
import { carts } from "#models/cart.model.js"
import { cart_items } from "#models/cart-items.model.js"
import { eq } from "drizzle-orm"
import { addProdToCart, deleteProduct, getCartProds, updateProdQuantity } from "#services/cart.service.js"

export const getCart = async (req, res) => {
    const userId = req.user?.id
    try {
        const data = await getCartProds(userId)

        res.status(200).json({
            message: "Cart products retrieved sucessfully",
            data
        })
    } catch (error) {
        logger.error(`Error fetching cart for user ${userId}: ${error.message}`, error)
        res.status(500).json({
            error: "Internal Server Error",
            message: "Eroare la preluarea coșului"
        });
    }
}

export const addToCart = async (req, res) => {
    const userId = req.user?.id
    const { productId, variantId, quantity } = req.body
    try {
        if (!productId || !variantId) {
            logger.warn(`addToCart called with missing fields (user=${userId}, productId=${productId}, variantId=${variantId})`)
            return res.status(400).json({
                error: "Bad Request",
                message: "productId și variantId sunt obligatorii"
            })
        }

        const data = await addProdToCart(userId, productId, variantId, quantity)

        res.status(200).json({
            message: "Item added to cart sucessfully",
            data
        })
    } catch (error) {
        logger.error(
            `Error adding product to cart (user=${userId}, productId=${productId}, variantId=${variantId}, qty=${quantity}): ${error.message}`,
            error
        )
        res.status(500).json({
            error: "Internal Server Error",
            message: "Eroare la adăugarea produsului în coș"
        });
    }
}

export const updateQuantity = async (req, res) => {
    const userId = req.user?.id
    const variantId = Number(req.params.id)
    const { nr } = req.body
    try {
        if (Number.isNaN(variantId)) {
            logger.warn(`updateQuantity called with invalid variantId by user ${userId}: ${req.params.id}`)
            return res.status(400).json({
                error: "Bad Request",
                message: "ID variantă invalid"
            })
        }

        const data = await updateProdQuantity(userId, variantId, nr)

        res.status(200).json({
            message: "Item in cart updated sucessfully",
            data
        })
    } catch (error) {
        logger.error(
            `Error updating cart quantity (user=${userId}, variantId=${variantId}, delta=${nr}): ${error.message}`,
            error
        )

        if (error.message?.includes("not found")) {
            return res.status(404).json({
                error: "Not Found",
                message: error.message
            })
        }

        res.status(500).json({
            error: "Internal Server Error",
            message: "Eroare la actualizarea cantității în coș"
        });
    }
}

export const removeItem = async (req, res) => {
    const userId = req.user?.id
    const variantId = Number(req.params.id)
    try {
        if (Number.isNaN(variantId)) {
            logger.warn(`removeItem called with invalid variantId by user ${userId}: ${req.params.id}`)
            return res.status(400).json({
                error: "Bad Request",
                message: "ID variantă invalid"
            })
        }

        const data = await deleteProduct(userId, variantId)

        res.status(200).json({
            message: "Item removed from cart sucessfully",
            data
        })
    } catch (error) {
        logger.error(
            `Error removing item from cart (user=${userId}, variantId=${variantId}): ${error.message}`,
            error
        )

        if (error.message?.includes("not found")) {
            return res.status(404).json({
                error: "Not Found",
                message: error.message
            })
        }

        res.status(500).json({
            error: "Internal Server Error",
            message: "Eroare la ștergerea produsului din coș"
        });
    }
}

export const deleteCartController = async (req, res) => {
    const userId = req.user?.id;
    try {
        const [userCart] = await db
            .select()
            .from(carts)
            .where(eq(carts.user_id, userId))
            .limit(1);

        if (!userCart) {
            logger.info(`deleteCartController: no cart found for user ${userId}, treating as already empty`)
            return res.status(200).json({ message: "Cart is already empty" });
        }

        await db
            .delete(cart_items)
            .where(eq(cart_items.cart_id, userCart.id));

        logger.info(`Cart ${userCart.id} cleared for user ${userId}`)

        return res.status(200).json({
            message: "Cart cleared successfully"
        });

    } catch (error) {
        logger.error(`Error clearing cart for user ${userId}: ${error.message}`, error);
        return res.status(500).json({
            error: "Internal server error",
            message: "Eroare la golirea coșului"
        });
    }
};

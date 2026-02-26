import logger from "#config/logger.js"
import { addProdToCart, deleteProduct, getCartProds, updateProdQuantity } from "#services/cart.service.js"

export const getCart=async (req,res)=>{
    try {
        const userId=req.user.id

        const data=await getCartProds(userId)

        res.status(200).json({
            message:"Cart products retrieved sucessfully",
            data
        })
    } catch (error) {
        logger.error("error fetching the cart fron the db")
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
}

export const addToCart=async (req,res)=>{
    try {
        const userId=req.user.id
        const {productId,variantId,quantity}=req.body

        const data=await addProdToCart(userId,productId,variantId,quantity)

        res.status(200).json({
            message:"Item added to cart sucessfully",
            data
        })
    } catch (error) {
        logger.error("error fetching the cart fron the db")
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
}

export const updateQuantity=async (req,res)=>{
    try {
        const userId = req.user.id
        const variantId = Number(req.params.id)
        const { nr } = req.body

        const data = await updateProdQuantity(userId, variantId, nr)

        res.status(200).json({
            message:"Item in cart updated sucessfully",
            data
        })
    } catch (error) {
        logger.error("error fetching the cart fron the db")
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
}

export const removeItem=async (req,res)=>{
    try {
        const userId = req.user.id
        const variantId = Number(req.params.id)

        const data = await deleteProduct(userId, variantId)

        res.status(200).json({
            message:"Item removed from cart sucessfully",
            data
        })
    } catch (error) {
        logger.error("error fetching the cart fron the db")
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
}

export const deleteCartController = async (req, res) => {
    try {
        const userId = req.user.id;

        const [userCart] = await db
            .select()
            .from(carts)
            .where(eq(carts.user_id, userId))
            .limit(1);

        if (!userCart) {
            return res.status(200).json({ message: "Cart is already empty" });
        }

        await db
            .delete(cartItems)
            .where(eq(cartItems.cart_id, userCart.id));

        return res.status(200).json({ 
            message: "Cart cleared successfully" 
        });

    } catch (error) {
        logger.error("Error clearing cart:", error);
        return res.status(500).json({ 
            error: "Internal server error",
            message: error.message 
        });
    }
};
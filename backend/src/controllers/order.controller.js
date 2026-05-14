import logger from "#config/logger.js";
import { createOrder, fetchDetails, fetchDetailsAdmin, getAllOrdersAdmin,fetchDetailsWithId, getOrdersByUserId, updateOrderAdmin, verifyStock } from "#services/order.service.js";
import { createPaymentSession } from "#services/payment.service.js";
import { formatValidationError } from "#utils/format.js";
import { createOrderSchema } from "#validations/order.validation.js";
import { db } from "#config/database.js";
import { orders } from "#models/order.model.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import { orderPlaced } from "#utils/emails/orderPlaced.js";
import { sendEmail } from "#services/email.service.js";
import { orderShipped } from "#utils/emails/orderShipping.js";

const stripe = new Stripe(process.env.STRIPE_API_KEY);

export const placeOrderController = async (req, res) => {
    let user_id = null;
    let stripeSessionId = null;
    try {
        // 1. User Authentication (Extract ID from token)
        const token = req.cookies.token;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user_id = decoded.id;
            } catch (err) {
                logger.warn(`placeOrderController: invalid token on checkout, proceeding as guest (${err.message})`);
            }
        }

        const body = req.body;

        // 2. Validate Body Structure (Zod)
        const result = createOrderSchema.safeParse(body);

        if (!result.success) {
            logger.warn(`placeOrderController validation failed (user=${user_id || 'guest'})`);
            return res.status(400).json({
                error: "Order Validation Failed",
                message: 'Validarea comenzii a eșuat',
                details: formatValidationError(result.error)
            });
        }

        const orderData = result.data;

        stripeSessionId = body.stripe_session_id || null;

        // 3. SECURITY & PAYMENT VERIFICATION
        if (orderData.payment_method === 'credit_card') {

            // A. Check if Session ID is present
            if (!stripeSessionId) {
                logger.warn(`placeOrderController: credit_card order missing stripe_session_id (user=${user_id || 'guest'})`);
                return res.status(400).json({
                    error: "Payment Verification Failed",
                    message: "Missing Stripe Session ID"
                });
            }

            // B. IDEMPOTENCY CHECK (Critical)
            // Prevent creating a duplicate order if the user refreshes the Success page
            const existingOrder = await db
                .select()
                .from(orders)
                .where(eq(orders.stripe_payment_id, stripeSessionId));

            if (existingOrder.length > 0) {
                logger.info(`Duplicate order attempt blocked for session ${stripeSessionId}, returning existing order ${existingOrder[0].id}`);
                return res.status(200).json({
                    message: "Order already processed",
                    id: existingOrder[0].id
                });
            }

            // C. Verify Payment Status with Stripe
            try {
                const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

                if (session.payment_status !== 'paid') {
                    logger.warn(`Unpaid Stripe session ${stripeSessionId} (status=${session.payment_status})`);
                    return res.status(402).json({
                        error: "Payment Required",
                        message: "The payment has not been confirmed by Stripe."
                    });
                }
            } catch (stripeError) {
                logger.error(`Stripe session retrieval failed (sessionId=${stripeSessionId}): ${stripeError.message}`, stripeError);
                return res.status(400).json({
                    error: "Payment Verification Failed",
                    message: "Invalid Session ID"
                });
            }
        }

        // 4. Fail Fast: Check Stock (Before Database Transaction)
        // Note: createOrder service performs a locked check, but this saves DB resources.
        await verifyStock(orderData.items);

        // 5. Create Order
        const insertResult = await createOrder({
            ...orderData,
            user_id: user_id,
            stripe_payment_id: stripeSessionId
        });

        if (!insertResult) {
            logger.error(`placeOrderController: createOrder returned no result (user=${user_id || 'guest'}, sessionId=${stripeSessionId})`);
            return res.status(500).json({
                error: "Could not place order",
                message: 'Eroare la plasarea comenzii'
            });
        }

        let shipping_cost = 0;
        if (orderData.total_ammount < 50000)
            shipping_cost = 2500;

        const orderDetails=await fetchDetailsWithId(insertResult.orderId)
        const items=orderDetails.items

        const fullName=orderData.first_name+" "+orderData.last_name
        sendEmail({
            to:orderData.email,
            subject:"Comandă plasat cu Succes!",
            text:"Comandă plasat cu Succes!",
            html:orderPlaced(
                orderData.email,
                orderData.phone,
                orderData.first_name,
                orderData.last_name,
                fullName,
                orderData.address_line,
                orderData.city,
                orderData.state,
                orderData.postal_code,
                orderData.country,
                orderData.total_ammount,
                shipping_cost,
                items,
                orderData.payment_method
            )
        })
        

        logger.info(`Order ${insertResult.orderId} placed successfully (user=${user_id || 'guest'}, payment=${orderData.payment_method})`);


        return res.status(201).json({
            message: "Order placed successfully",
            id: insertResult.orderId
        });

    } catch (error) {
        const msg = error?.message || '';
        logger.error(`Error placing order (user=${user_id || 'guest'}, sessionId=${stripeSessionId}): ${msg}`, error);

        if (msg.includes("Insufficient stock") || msg.includes("Product variant")) {
            return res.status(409).json({
                error: "Inventory Error",
                message: msg
            });
        }

        if (msg.includes("not found")) {
            return res.status(404).json({ error: "Order not found", message: 'Comanda nu a fost găsită' });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Eroare la plasarea comenzii'
        });
    }
};

export const checkStock = async (req, res) => {
    try {
        const items = req.body.items
        if (!Array.isArray(items)) {
            logger.warn('checkStock called without an items array');
            return res.status(400).json({
                error: "Bad Request",
                message: "Lista de produse este obligatorie"
            });
        }
        await verifyStock(items)

        return res.status(200).json({
            message: "all items in stock!"
        })
    } catch (error) {
        const msg = error?.message || '';
        logger.error(`Error verifying stock: ${msg}`, error);

        if (msg.includes("Insufficient stock") || msg.includes("Product variant")) {
            return res.status(409).json({ // 409 = Conflict
                error: "Inventory Error",
                message: msg
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Eroare la verificarea stocului'
        });
    }
}

export const payOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            logger.warn('payOrder called with no items');
            return res.status(400).json({ error: "No items provided", message: 'Nu au fost furnizate produse' });
        }

        const paymentUrl = await createPaymentSession({ items });

        logger.info(`Stripe payment session created for ${items.length} item(s)`);

        return res.status(200).json({ url: paymentUrl });

    } catch (error) {
        logger.error(`Error creating payment session (itemCount=${req.body?.items?.length}): ${error.message}`, error);
        return res.status(500).json({
            error: "Failed to initialize payment",
            message: 'Eroare la inițierea plății'
        });
    }
};

export const getOrdersController = async (req, res) => {
    const userId = req.user?.id
    try {
        const result = await getOrdersByUserId(userId)

        return res.status(200).json({
            result
        })
    } catch (error) {
        logger.error(`Error fetching orders for user ${userId}: ${error.message}`, error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Eroare la preluarea comenzilor'
        });
    }
}

export const getOrderDetails = async (req, res) => {
    const userId = req.user?.id
    const orderId = Number(req.params.id)
    try {
        if (Number.isNaN(orderId)) {
            logger.warn(`getOrderDetails called with invalid orderId by user ${userId}: ${req.params.id}`);
            return res.status(400).json({ error: "Bad Request", message: "ID comandă invalid" });
        }

        const result = await fetchDetails(userId, orderId)

        res.status(200).json(result)
    } catch (error) {
        const msg = error?.message || '';
        logger.error(`Error fetching order details (user=${userId}, orderId=${orderId}): ${msg}`, error);

        if (msg.includes("not found") || msg.includes("access denied")) {
            return res.status(404).json({ error: "Order not found", message: 'Comanda nu a fost găsită' });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Eroare la preluarea detaliilor comenzii'
        });
    }
}


//admin

export const getAdminOrders = async (req, res) => {
    try {
        const { page, limit, email, orderId } = req.query

        const pageNum = parseInt(page) || 1
        const limitNum = parseInt(limit) || 10

        const result = await getAllOrdersAdmin(pageNum, limitNum, email, orderId)

        return res.status(200).json(result)
    } catch (error) {
        logger.error(`Error fetching admin orders (query=${JSON.stringify(req.query)}, admin=${req.user?.email}): ${error.message}`, error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Eroare la preluarea comenzilor pentru admin'
        });
    }
}

export const getAdminOrder = async (req, res) => {
    const orderId = Number(req.params.id)
    try {
        if (Number.isNaN(orderId)) {
            logger.warn(`getAdminOrder called with invalid orderId: ${req.params.id}`);
            return res.status(400).json({ error: "Bad Request", message: "ID comandă invalid" });
        }

        const result = await fetchDetailsAdmin(orderId)

        res.status(200).json(result)
    } catch (error) {
        const msg = error?.message || '';
        logger.error(`Error fetching admin order details (orderId=${orderId}, admin=${req.user?.email}): ${msg}`, error);

        if (msg.includes("not found") || msg.includes("access denied")) {
            return res.status(404).json({ error: "Order not found", message: 'Comanda nu a fost găsită' });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Eroare la preluarea detaliilor comenzii'
        });
    }
}

export const updateAdminOrder = async (req, res) => {
    const orderId = Number(req.params.id);
    const { status } = req.body;
    try {
        if (Number.isNaN(orderId)) {
            logger.warn(`updateAdminOrder called with invalid orderId: ${req.params.id}`);
            return res.status(400).json({ error: "Bad Request", message: "ID comandă invalid" });
        }

        const result = await updateOrderAdmin(orderId, status);

        const emailResult = await sendEmail({
            to: result.email,
            subject: "Comanda este în curs de livrare",
            text: "Comanda ta a fost procesată și este în drum spre tine!",
            html: orderShipped(result.first_name, result.last_name, result.id)
        })

        if (!emailResult.success) {
            logger.warn(`updateAdminOrder: shipping email failed for order ${orderId} to ${result.email}`);
        }

        logger.info(`Order ${orderId} status changed to "${status}" by admin ${req.user?.email || 'unknown'}`);

        res.status(200).json({
            message: "Order updated successfully",
            result: result
        });
    } catch (error) {
        const msg = error?.message || '';
        logger.error(`Error updating order ${orderId} to status="${status}" (admin=${req.user?.email}): ${msg}`, error);

        const statusCode = msg.includes('invalid') || msg.includes('găsită') ? 400 : 500;

        return res.status(statusCode).json({
            error: statusCode === 500 ? 'Internal server error' : 'Validation Error',
            message: statusCode === 500 ? 'Eroare la actualizarea comenzii' : msg
        });
    }
}
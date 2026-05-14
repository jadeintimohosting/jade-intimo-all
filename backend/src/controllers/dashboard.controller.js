import logger from "#config/logger.js"
import { getLowStockProducts, getPendingOrdersFunction, getRecentOrders } from "#services/admin.service.js"

export const getOrderEvolution = async (req, res) => {
    const { days } = req.params
    try {
        const result = await getRecentOrders(days)

        res.status(200).json({
            message: "Evolution received sucessfully",
            arr: result.data,
            orders: result.totalOrders,
            total: result.totalRevenue
        })
    } catch (error) {
        logger.error(`Error fetching order evolution (days=${days}, admin=${req.user?.email}): ${error.message}`, error)
        res.status(500).json({
            error: "Internal server error",
            message: "Eroare la preluarea evoluției comenzilor"
        })
    }
}

export const getLowStock = async (req, res) => {
    try {
        const result = await getLowStockProducts()
        res.status(200).json({
            message: "Produsele cu stoc scazut au fost preluate cu secces",
            arr: result.items,
            total: result.total
        })
    } catch (error) {
        logger.error(`Error fetching low stock products (admin=${req.user?.email}): ${error.message}`, error)
        res.status(500).json({
            error: "Internal server error",
            message: "Eroare la preluarea produselor cu stoc scăzut"
        })
    }
}

export const getPendingOrders = async (req, res) => {
    try {
        const result = await getPendingOrdersFunction()
        res.status(200).json({
            message: "Comenzile in asteptare au fost preluate cu succes",
            arr: result.orderArr,
            total: result.total
        })
    } catch (error) {
        logger.error(`Error fetching pending orders (admin=${req.user?.email}): ${error.message}`, error)
        res.status(500).json({
            error: "Internal server error",
            message: "Eroare la preluarea comenzilor în așteptare"
        })
    }
}

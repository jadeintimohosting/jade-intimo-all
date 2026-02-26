import logger from "#config/logger.js"
import { getLowStockProducts, getPendingOrdersFunction, getRecentOrders } from "#services/admin.service.js"

export const getOrderEvolution=async (req,res)=>{
    try {
        const {days}=req.params
        const result=await getRecentOrders(days)

        res.status(200).json({
            message:"Evolution received sucessfully",
            arr:result.data,
            orders:result.totalOrders,
            total:result.totalRevenue
        })
    } catch (error) {
        logger.error("error in getting order evolution", error)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const getLowStock=async (req,res)=>{
    try {
        const result=await getLowStockProducts()
        res.status(200).json({
            message:"Produsele cu stoc scazut au fost preluate cu secces",
            arr:result.items,
            total:result.total
        })
    } catch (error) {
        logger.error("error in getting low stock products", error)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const getPendingOrders=async (req,res)=>{
    try {
        const result=await getPendingOrdersFunction()
        res.status(200).json({
            message:"Comenzile in asteptare au fost preluate cu succes",
            arr:result.orderArr,
            total:result.total
        })
    } catch (error) {
        logger.error("error in getting pending orders", error)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}
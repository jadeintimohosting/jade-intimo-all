import { 
    getNewProducts, 
    getProductById, 
    getProducts,
    getProductsAdmin,
    createProductAdmin,
    updateProductAdmin,
    deleteProductAdmin,
    createVariantAdmin,
    updateVariantAdmin,
    generateUploadUrl,
    deleteVariantAdmin,
} from "#controllers/products.controller.js";
import { adminRoute } from "#middleware/admin.middleware.js";
import { authenticateToken } from "#middleware/auth.middleware.js";
import { apiLimiter } from "#config/rateLimiter.js";
import express from "express";

const router=express.Router()

//admin endpoints

router.route("/admin")
    .get(apiLimiter(15 * 60 * 1000, 200), authenticateToken,adminRoute,getProductsAdmin) // aici sa fac si variante si produs sa fie mai usor cu stocu
    .post(apiLimiter(15 * 60 * 1000, 50), authenticateToken,adminRoute,createProductAdmin)

router.post("/admin/upload-url",apiLimiter(15 * 60 * 1000, 50), authenticateToken,generateUploadUrl)

router.route("/admin/item/:id")
    .put(apiLimiter(15 * 60 * 1000, 50), authenticateToken,adminRoute,updateProductAdmin)
    .delete(apiLimiter(15 * 60 * 1000, 50), authenticateToken,adminRoute,deleteProductAdmin)

router.route("/admin/variant/:id")
    .post(apiLimiter(15 * 60 * 1000, 50), authenticateToken,adminRoute,createVariantAdmin)
    .put(apiLimiter(15 * 60 * 1000, 50), authenticateToken,adminRoute,updateVariantAdmin)
    .delete(apiLimiter(15 * 60 * 1000, 50), authenticateToken,adminRoute,deleteVariantAdmin)

//user endpoints

router.get("/",apiLimiter(15 * 60 * 1000, 500),getProducts)
router.get('/new',apiLimiter(15 * 60 * 1000, 500),getNewProducts)
router.get("/:id",apiLimiter(15 * 60 * 1000, 500),getProductById)

export default router;
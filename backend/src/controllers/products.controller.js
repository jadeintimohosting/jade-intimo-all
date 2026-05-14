//user role controllers

import { db } from "#config/database.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import { r2Client, R2_BUCKET_NAME, PUBLIC_IMAGE_DOMAIN } from '../config/r2.js'; // Adjust path
import logger from "#config/logger.js"
import { products } from "#models/product.model.js";
import { insertProduct, insertVariant, retrieveAllProducts, retrieveNewArrivals, retrieveProductById, updateProduct, updateVariant } from "#services/products.service.js"
import { createProductSchema, createVariantScheema, updateProductScheema, updateVariantScheema } from "#validations/product.validation.js";
import { formatValidationError } from "#utils/format.js";
import { eq } from "drizzle-orm";
import { product_variants } from "#models/product-variant.model.js";

export const getProducts = async (req, res) => {
    try {
        const { page, limit, gender, category, subCategory ,sortBy,keyword} = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;

        const data = await retrieveAllProducts(
            pageNum, 
            limitNum, 
            gender, 
            category, 
            subCategory,
            sortBy,
            keyword
        );

        logger.info(`Products retrieved successfully - Page: ${pageNum}`);

        res.status(200).json({
            message: "Data retrieved successfully",
            ...data
        });

    } catch (error) {
        logger.error(`Error in getProducts (query=${JSON.stringify(req.query)}): ${error.message}`, error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Eroare la preluarea produselor"
        });
    }
};

export const getNewProducts = async (req, res) => {
    try {
        const { limit } = req.query

        const data = await retrieveNewArrivals(limit)

        logger.info(`New arrivals retrieved (limit=${limit || 'default'})`)

        res.status(200).json({
            message: "new products retrieved sucessfully",
            products: data
        })
    } catch (error) {
        logger.error(`Error fetching new arrivals (limit=${req.query?.limit}): ${error.message}`, error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Eroare la preluarea noilor produse"
        });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params
    const productId = Number(id)
    try {
        if (Number.isNaN(productId)) {
            logger.warn(`getProductById called with invalid id: ${id}`)
            return res.status(400).json({ error: "Bad Request", message: "ID produs invalid" })
        }

        const data = await retrieveProductById(productId)

        if (!data) {
            logger.warn(`getProductById: product ${productId} not found`)
            return res.status(404).json({ error: "Not Found", message: "Produsul nu a fost găsit" })
        }

        logger.info(`Product ${productId} retrieved successfully`)

        res.status(200).json({
            message: `product with id ${productId} retrieved successfully`,
            product: data
        })
    } catch (error) {
        logger.error(`Error retrieving product id=${productId}: ${error.message}`, error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Eroare la preluarea produsului"
        });
    }
}

//admin role controllers


export const getVariantsById = async (req, res) => {
    const { id } = req.params
    const productId = Number(id)
    try {
        if (Number.isNaN(productId)) {
            logger.warn(`getVariantsById called with invalid id: ${id}`)
            return res.status(400).json({ error: "Bad Request", message: "ID produs invalid" })
        }

        const data = await retrieveProductById(productId)

        if (!data) {
            logger.warn(`getVariantsById: product ${productId} not found`)
            return res.status(404).json({ error: "Not Found", message: "Produsul nu a fost găsit" })
        }

        logger.info(`Variants for product ${productId} retrieved successfully`)

        res.status(200).json({
            message: `product with id ${productId} retrieved successfully`,
            product: data
        })
    } catch (error) {
        logger.error(`Error retrieving variants for product id=${productId}: ${error.message}`, error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Eroare la preluarea variantelor"
        });
    }
}

export const getProductsAdmin = async (req, res) => {
    try {
        const { page, limit, gender, category, subCategory ,sortBy} = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;

        const data = await retrieveAllProducts(
            pageNum, 
            limitNum, 
            gender, 
            category, 
            subCategory,
            sortBy
        );

        logger.info(`Products for admin retrieved successfully - Page: ${pageNum}`);

        res.status(200).json({
            message: "Data for admin retrieved successfully",
            ...data
        });

    } catch (error) {
        logger.error(`Error in getProductsAdmin (query=${JSON.stringify(req.query)}): ${error.message}`, error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Eroare la preluarea produselor pentru admin"
        });
    }
};

export const createProductAdmin = async (req, res) => {
    try {
        // 1. Sanitize Data
        const rawPrice = Number(req.body.price);

        const body = {
            ...req.body,
            // Handle Price: 10.5 -> 1050. If invalid, returns NaN (Zod catches NaN)
            price: isNaN(rawPrice) ? undefined : Math.round(rawPrice*100), 

            // Handle Boolean
            bigSizes: req.body.bigSizes === true || req.body.bigSizes === "true",

            // Handle Empty Strings -> Null (Crucial for Zod Enums)
            subCategory: req.body.subCategory === "" ? null : req.body.subCategory,
            description: req.body.description === "" ? null : req.body.description,
            material: req.body.material === "" ? null : req.body.material,
            
            // Handle Image: If frontend sends null, keep it null. If empty string, make null.
            image: (!req.body.image || req.body.image === "") ? null : req.body.image,
        };

        // 2. Validate
        const result = createProductSchema.safeParse(body);

        if (!result.success) {
            // Log full error for debugging
            logger.warn("Validation failed:", JSON.stringify(result.error.format(), null, 2));
            
            return res.status(400).json({
                error: 'Validare Esuata',
                message: 'Validare produs eșuată',
                details: result.error.format(), // Send this to frontend to see WHICH field failed
            });
        }

        // 3. Insert
        const product = await insertProduct(result.data);

        logger.info(`Product created by admin ${req.user?.email || 'unknown'}: id=${product.id}, name="${product.name}"`);

        return res.status(201).json({
            message: "Product created successfully",
            product: product
        });

    } catch (error) {
        logger.error(`Error creating product (admin=${req.user?.email}): ${error.message}`, error);
        return res.status(500).json({
            error: 'Internal server error',
            message: "Eroare la crearea produsului"
        });
    }
};

export const updateProductAdmin = async (req, res) => {
    const { id } = req.params
    const productId = Number(id)
    try {
        if (Number.isNaN(productId)) {
            logger.warn(`updateProductAdmin called with invalid id: ${id}`)
            return res.status(400).json({ error: "Bad Request", message: "ID produs invalid" })
        }

        const validationResult = updateProductScheema.safeParse(req.body)

        if (!validationResult.success) {
            logger.warn(`updateProductAdmin validation failed for product ${productId}`);
            return res.status(400).json({
                error: 'Actualizarea Produsului Esuata',
                details: formatValidationError(validationResult.error),
            });
        }

        const data = { ...validationResult.data }

        const product = await updateProduct(productId, data)

        if (!product) {
            logger.warn(`updateProductAdmin: product ${productId} not found`);
            return res.status(404).json({ error: 'Produsul nu a fost găsit', message: 'Produsul nu a fost găsit' });
        }

        logger.info(`Product ${productId} updated by admin ${req.user?.email || 'unknown'}`);

        return res.status(200).json({
            message: "product updated sucessfully",
            product: product
        })
    } catch (error) {
        logger.error(`Error updating product id=${productId} (admin=${req.user?.email}): ${error.message}`, error);
        return res.status(500).json({ error: 'Internal server error', message: 'Eroare internă a serverului' });
    }
}

export const deleteProductAdmin = async (req, res) => {
    const { id } = req.params;
    const productId = Number(id);
    try {
        if (Number.isNaN(productId)) {
            logger.warn(`deleteProductAdmin called with invalid id: ${id}`)
            return res.status(400).json({ error: "Bad Request", message: "ID produs invalid" })
        }

        // --- MODIFICARE AICI ---
        // Facem update în loc de delete fizic
        const [deleted] = await db
            .update(products)
            .set({ is_deleted: true })
            .where(eq(products.id, productId))
            .returning();

        if (!deleted) {
            logger.warn(`deleteProductAdmin: product ${productId} not found`);
            return res.status(404).json({
                error: "Produsul nu a fost găsit",
                message: `Nu există niciun produs cu ID-ul ${productId}`
            });
        }

        logger.info(`Product soft-deleted by admin ${req.user?.email || 'unknown'}: "${deleted.name}" (id=${deleted.id})`);

        return res.status(200).json({
            message: "Produsul a fost șters cu succes (Soft Delete)",
            deletedProduct: deleted
        });

    } catch (error) {
        logger.error(`Error soft-deleting product id=${productId} (admin=${req.user?.email}): ${error.message}`, error);
        return res.status(500).json({
            error: "Internal server error",
            message: "Eroare la ștergerea produsului"
        });
    }
};

export const createVariantAdmin = async (req, res) => {
    const { id } = req.params
    const productId = Number(id)
    try {
        if (Number.isNaN(productId)) {
            logger.warn(`createVariantAdmin called with invalid product id: ${id}`)
            return res.status(400).json({ error: "Bad Request", message: "ID produs invalid" })
        }

        const validationResult = createVariantScheema.safeParse(req.body)

        if (!validationResult.success) {
            logger.warn(`createVariantAdmin validation failed for product ${productId}`);
            return res.status(400).json({
                error: 'Crearea Variantei Esuata',
                details: formatValidationError(validationResult.error),
            });
        }

        const data = { ...validationResult.data }

        const variant = await insertVariant(productId, data)

        if (!variant) {
            logger.error(`createVariantAdmin: insert returned no variant for product ${productId}`);
            return res.status(500).json({ error: 'Could not create variant', message: 'Nu s-a putut crea varianta' });
        }

        logger.info(`Variant ${variant.id} created for product ${productId} by admin ${req.user?.email || 'unknown'}`);

        return res.status(201).json({
            message: "variant created successfully",
            variant: variant
        });

    } catch (error) {
        logger.error(`Error creating variant for product id=${productId} (admin=${req.user?.email}): ${error.message}`, error)
        return res.status(500).json({
            error: "Internal server error",
            message: "Eroare la crearea variantei"
        });
    }
}

export const updateVariantAdmin = async (req, res) => {
    const { id } = req.params
    const variantId = Number(id)
    try {
        if (Number.isNaN(variantId)) {
            logger.warn(`updateVariantAdmin called with invalid id: ${id}`)
            return res.status(400).json({ error: "Bad Request", message: "ID variantă invalid" })
        }

        const validationResult = updateVariantScheema.safeParse(req.body)

        if (!validationResult.success) {
            logger.warn(`updateVariantAdmin validation failed for variant ${variantId}`);
            return res.status(400).json({
                error: 'Actualizarea Variantei Esuata',
                details: formatValidationError(validationResult.error),
            });
        }

        const data = { ...validationResult.data }

        const updatedVariant = await updateVariant(variantId, data)

        if (!updatedVariant) {
            logger.warn(`updateVariantAdmin: variant ${variantId} not found`);
            return res.status(404).json({ error: 'Could not update variant', message: 'Nu s-a putut actualiza varianta' });
        }

        logger.info(`Variant ${variantId} updated by admin ${req.user?.email || 'unknown'}`);

        return res.status(201).json({
            message: "variant updated successfully",
            variant: updatedVariant
        });
    } catch (error) {
        logger.error(`Error updating variant id=${variantId} (admin=${req.user?.email}): ${error.message}`, error)
        return res.status(500).json({
            error: "Internal server error",
            message: "Eroare la actualizarea variantei"
        });
    }
}

export const deleteVariantAdmin = async (req, res) => {
    const { id } = req.params;
    const variantId = parseInt(id, 10);
    try {
        if (isNaN(variantId)) {
            logger.warn(`deleteVariantAdmin called with invalid id: ${id}`)
            return res.status(400).json({ message: "ID-ul trebuie să fie un număr valid" });
        }

        const result = await db
            .update(product_variants)
            .set({
                is_deleted: true
            })
            .where(eq(product_variants.id, variantId))
            .returning();

        if (result.length === 0) {
            logger.warn(`deleteVariantAdmin: variant ${variantId} not found`);
            return res.status(404).json({ message: "Varianta nu a fost găsită" });
        }

        logger.info(`Variant ${variantId} soft-deleted by admin ${req.user?.email || 'unknown'}`);

        return res.status(200).json({
            message: "Varianta a fost ștearsă cu succes",
            deletedVariant: result[0]
        });

    } catch (error) {
        logger.error(`Error soft-deleting variant id=${variantId} (admin=${req.user?.email}): ${error.message}`, error);
        return res.status(500).json({
            error: "Eroare internă a serverului",
            message: "Eroare la ștergerea variantei"
        });
    }
}


export const generateUploadUrl = async (req, res) => {
    try {
        const { fileType } = req.body;

        // 1. SAFETY CHECK: Crash early if server config is wrong
        // This prevents the "undefined/image.png" error
        if (!PUBLIC_IMAGE_DOMAIN) {
            logger.error("CRITICAL: PUBLIC_IMAGE_DOMAIN is missing in .env or config");
            return res.status(500).json({ error: "Server configuration error", message: 'Configurare server invalidă' });
        }

        if (!fileType) {
            return res.status(400).json({ error: "File type is required", message: 'Tipul fișierului este obligatoriu' });
        }

        // 2. BETTER EXTENSION HANDLING
        // Map MIME types to strict extensions
        const mimeToExt = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',  
            'image/png': 'png',
            'image/webp': 'webp',
            'image/heic': 'heic',
            'image/heif': 'heif',
            'image/avif': 'avif',
            'image/gif': 'gif'
        };

        const extension = mimeToExt[fileType];

           if (!extension) {
               return res.status(400).json({ error: "Invalid file type. Only JPG, PNG, and WebP allowed.", message: 'Tip fișier invalid. Sunt permise doar JPG, PNG și WebP.' });
           }

        const fileName = `${uuidv4()}.${extension}`;

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            ContentType: fileType, // ContentType matches the input (e.g. image/jpeg)
        });

        // Generate the URL valid for 5 minutes
        const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

        logger.info(`Generated upload URL for file: ${fileName}`);

        // 3. CLEAN URL GENERATION
        // Remove trailing slash from domain if it exists, to avoid double //
        const cleanDomain = PUBLIC_IMAGE_DOMAIN.replace(/\/$/, "");

        return res.status(200).json({
            uploadUrl,
            publicUrl: `${cleanDomain}/${fileName}`
        });

    } catch (error) {
        logger.error(`Error generating upload URL (fileType=${req.body?.fileType}): ${error.message}`, error);
        return res.status(500).json({ error: "Could not generate upload URL", message: 'Nu s-a putut genera URL-ul de încărcare' });
    }
};
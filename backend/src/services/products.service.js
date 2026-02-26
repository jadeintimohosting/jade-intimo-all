import { db } from "#config/database.js"
import logger from "#config/logger.js";
import { product_variants } from "#models/product-variant.model.js";
import { products } from "#models/product.model.js"
import { count as countFn } from "drizzle-orm"
import { eq, desc ,and, asc, ilike} from "drizzle-orm";

export const retrieveAllProducts = async (
    page = 1, 
    limit = 10, 
    gender = "", 
    category = "", 
    subCategory = "", 
    sortBy = "newest",
    keyword = ""
) => {
    try {
        const offset = (page - 1) * limit;

        const filters = [];
        
        // Existing exact-match filters
        if (gender) filters.push(eq(products.gender, gender));
        if (category) filters.push(eq(products.category, category));
        if (subCategory) filters.push(eq(products.subCategory, subCategory));
        
        // --- NEW KEYWORD SEARCH FILTER ---
        if (keyword) {
            filters.push(ilike(products.name, `%${keyword}%`));
        }

        const whereClause = filters.length > 0 ? and(...filters) : undefined;

        let orderByClause;
        switch (sortBy) {
            case "price-low-high":
                orderByClause = asc(products.price);
                break;
            case "price-high-low":
                orderByClause = desc(products.price);
                break;
            
            case "newest":
            default:
                orderByClause = desc(products.created_at);
                break;
        }

        let query = db.select().from(products);
        if (whereClause) query = query.where(whereClause);

        const data = await query
            .orderBy(orderByClause)
            .limit(limit)
            .offset(offset);

        let countQuery = db.select({ value: countFn() }).from(products);
        if (whereClause) countQuery = countQuery.where(whereClause);

        const [totalCountResult] = await countQuery;
        
        const totalItems = totalCountResult?.value || 0;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            products: data,
            pagination: {
                totalItems,
                totalPages,
                currentPage: Number(page),
                itemsPerPage: Number(limit)
            }
        };

    } catch (error) {
        logger.error("Error fetching products:", error);
        throw new Error("Could not retrieve products from the database");
    }
};


export const retrieveNewArrivals = async (limit=20) => {
  try {
    const womenNewest = await db
      .select()
      .from(products)
      .where(eq(products.gender, "women"))
      .orderBy(desc(products.created_at))
      .limit(limit);

    const menNewest = await db
      .select()
      .from(products)
      .where(eq(products.gender, "men"))
      .orderBy(desc(products.created_at))
      .limit(limit);

    return {
      women: womenNewest,
      men: menNewest,
    };
  } catch (error) {
    logger.error("Error fetching new arrivals:", error);
    throw new Error("Could not retrieve new arrivals");
  }
};


export const retrieveProductById = async (productId) => {
    try {
        const [product] = await db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        const variants = await db
            .select()
            .from(product_variants)
            .where(eq(product_variants.product_id, productId));

        if (!product) {
            return null;
        }
        return {
            product: product,
            variants: variants
        };
    } catch (error) {
        logger.error(`Error retrieving product with ID ${productId}:`, error);
        throw new Error("Database query failed");
    }
};



export const insertProduct = async (productData) => {
    try {
        const [created] = await db.insert(products).values({
            gender: productData.gender,
            category: productData.category,
            subCategory: productData.subCategory || null,
            name: productData.name,
            image: productData.image || null,
            description: productData.description || null,
            material: productData.material || null,
            price: productData.price,
            bigSizes: productData.bigSizes ?? false,
            cod:productData.cod,
            image_list:productData.image_list   
        }).returning();

        return created;
    } catch (error) {
        logger.error("Error inserting product into DB:", error);
        throw new Error("Could not insert product record");
    }
};

export const updateProduct = async (id, data) => {
    try {
        const [updatedProduct] = await db
            .update(products)
            .set({
                ...data,
            })
            .where(eq(products.id, id))
            .returning();

        if (!updatedProduct) {
            return null;
        }

        return updatedProduct;
    } catch (error) {
        logger.error(`Error updating product ${id}:`, error);
        throw new Error("Failed to update product in database");
    }
};


export const insertVariant=async (id,data)=>{
    try {
        const [variant]=await db.insert(product_variants)
            .values({
                product_id:id,
                size:data.size,
                quantity:data.quantity
            })
            .returning()
        
        return variant
    } catch (error) {
        logger.error("Error creating product variant:", error);
        throw new Error("Could not create product variant");
    }
}

export const updateVariant=async (id,data)=>{
    try {
        const [variant]=await db
            .update(product_variants)
            .set({...data})
            .where(eq(product_variants.id,id))
            .returning()

        if(!variant)
            return null

        return variant  
    } catch (error) {
        logger.error("error updating the variant",error)
        throw new Error("Could not update product variant")
    }
}



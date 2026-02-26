import { categoryArray, genderArray, subcategoryArray } from "#models/product.model.js";
import z, { string } from "zod";

// validations/productSchema.js (or wherever this is)
export const createProductSchema = z.object({
  name: z.string().trim().min(3).max(255),
  
  gender: z.enum(genderArray, {
    errorMap: () => ({ message: "Select a valid gender" }),
  }),
  
  category: z.enum(categoryArray, {
    errorMap: () => ({ message: "Select a valid category" }),
  }),

  // Optional fields: Must handle nulls
  subCategory: z.enum(subcategoryArray).optional().nullable(),
  
  // Description/Material are optional strings
  description: z.string().optional().nullable(),
  material: z.string().optional().nullable(),

  // Price must be positive integer (cents)
  price: z.number({ invalid_type_error: "Price must be a number" }).int().positive(),
  
  bigSizes: z.boolean().default(false),

  // Image is a URL string, optional
  image: z.string().optional().nullable(), 
  
  image_list: z.array(z.string()).optional().nullable(),
  
  cod: z.string().trim().max(64)
});

export const updateProductScheema = z.object({
  gender: z.enum(genderArray, {
    errorMap: () => ({ message: "Gender must be either 'women' or 'men'" }),
  }).optional(),
  
  category: z.enum(categoryArray, {
    errorMap: () => ({ message: "Invalid category slug provided" }),
  }).optional(),
  subCategory: z.enum(subcategoryArray).optional().nullable(),
  
  name: z.string().trim().min(3, "Name must be at least 3 chars").max(255).optional(),
  image: z.string().optional(),
  description: z.string().min(1, "Description is required").optional(),
  material: z.string().min(2, "Material description is too short").optional(),

  price: z.number().int().positive("Price must be a positive whole number in cents").optional(),
  
  bigSizes: z.boolean().optional(),
});

export const createVariantScheema = z.object({
  size: z.string().min(1, "Size is required").max(32, "Size is too long"),
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
});

export const updateVariantScheema = z.object({
  size: z.string().min(1, "Size is required").max(32, "Size is too long").optional(),
  quantity: z.number().int().nonnegative("Quantity cannot be negative").optional(),
});

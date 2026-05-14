import z from "zod";

// 1. Schema for individual items in the cart
const orderItemSchema = z.object({
  variant_id: z.number({
    required_error: "Product variant ID is required"
  }).int().positive(),
  
  quantity: z.number()
    .int()
    .positive("Quantity must be at least 1"),
    
  price: z.number()
    .int()
    .positive("Price must be a positive whole number in cents"),
});

// 2. Main Order Creation Schema
export const createOrderSchema = z.object({

  // Contact Information
  email: z.string().email("Invalid email address"),
  first_name: z.string().trim().min(2, "First name is too short").max(128),
  last_name: z.string().trim().min(2, "Last name is too short").max(128),

  // Address Information
  address_line: z.string().trim().min(5, "Address is too short").max(255),
  city: z.string().trim().min(2, "City name is too short").max(128),
  state: z.string().trim().min(2, "State name is too short").max(128),
  postal_code: z.string().trim().min(3, "Postal code is too short").max(16),
  country: z.string().trim().min(2, "Country name is too short").max(128),

  // Order Details
  total_ammount: z.number()
    .int()
    .positive("Total ammount must be a positive number in cents"),
    
  // Ensure the order has at least one item
  items: z.array(orderItemSchema)
    .min(1, "Order must contain at least one item"),
    
  // Optional: If you want to validate the payment method field we added to the frontend
  payment_method: z.enum(['credit_card', 'cod'], {
     errorMap: () => ({ message: "Invalid payment method" }),
  }).optional(),
});
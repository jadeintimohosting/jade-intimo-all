import { z } from "zod";

// --- Signup Schema ---
export const signupScheema = z.object({
  first_name: z.string()
    .min(2, "Prenumele trebuie să aibă cel puțin 2 caractere")
    .max(255, "Prenumele este prea lung")
    .trim(),
  last_name: z.string()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere")
    .max(255, "Numele este prea lung")
    .trim(),
  phone: z.string()
    .min(10, "Numărul de telefon nu este valid")
    .max(32, "Numărul de telefon este prea lung")
    .trim(),
  email: z.email("Adresa de email nu este validă")
    .max(255, "Email-ul este prea lung")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, "Parola trebuie să aibă cel puțin 6 caractere")
    .max(128, "Parola este prea lungă"),
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: "Rol invalid" })
  }).default('user'),
});

export const loginScheema = z.object({
  email: z.email("Adresa de email nu este validă")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, "Parola este obligatorie"),
});

export const updateUserSchema = z.object({
  first_name: z.string()
    .min(2, "Prenumele trebuie să aibă cel puțin 2 caractere")
    .max(255)
    .trim()
    .optional(),
  last_name: z.string()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere")
    .max(255)
    .trim()
    .optional(),
  phone: z.string()
    .max(32, "Numărul de telefon este prea lung")
    .trim()
    .optional(),
});

export const addAddress = z.object({
  address_line: z.string()
    .min(1, "Adresa este obligatorie")
    .max(255)
    .trim(),
  city: z.string()
    .min(1, "Orașul este obligatoriu")
    .max(128)
    .trim(),
  state: z.string()
    .min(1, "Județul/Statul este obligatoriu")
    .max(128)
    .trim(),
  postal_code: z.string()
    .min(1, "Codul poștal este obligatoriu")
    .max(16)
    .trim(),
  country: z.string()
    .min(1, "Țara este obligatorie")
    .max(128)
    .trim(),
});

export const updateAddress = z.object({
  address_line: z.string().min(1, "Adresa nu poate fi goală").max(255).trim().optional(),
  city: z.string().min(1, "Orașul nu poate fi gol").max(128).trim().optional(),
  state: z.string().min(1, "Statul nu poate fi gol").max(128).trim().optional(),
  postal_code: z.string().min(1, "Codul poștal nu poate fi gol").max(16).trim().optional(),
  country: z.string().min(1, "Țara nu poate fi goală").max(128).trim().optional(),
});
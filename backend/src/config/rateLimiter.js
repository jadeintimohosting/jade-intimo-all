import rateLimit from "express-rate-limit"

export const apiLimiter=(windowMs,max)=>{
    return rateLimit({
        windowMs:windowMs,
        max:max,
        message: {
            error: `Ai trimis prea multe request-uri de la acest IP. Te rugăm să încerci din nou după ${windowMs/(1000*60)} minute.`
        },
        standardHeaders: true, 
        legacyHeaders: false,
    })
}
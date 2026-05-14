import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path'; // Importă path pentru gestionarea căilor
import { fileURLToPath } from 'url'; // Necesar pentru __dirname în ES Modules

import authRoutes from '#routes/auth.routes.js';
import productRoutes from "#routes/product.routes.js"
import cartRoutes from "#routes/cart.routes.js"
import orderRoutes from "#routes/order.routes.js"
import adminRoutes from "#routes/dashboard.routes.js"

// Configurare __dirname pentru ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);

// Modifică Helmet pentru a permite resursele încărcate de frontend-ul tău
app.use(helmet({
  contentSecurityPolicy: false, // Dezactivăm CSP temporar pentru a nu bloca scripturile proprii
}));

app.use(cors({
  origin: [
    "http://localhost:8080",
    "https://jadeintimo-frontend-production.up.railway.app",
    "https://jadeintimo.ro",
    "https://www.jadeintimo.ro"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

// --- RUTE API ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'the api is running' });
});

app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/order",orderRoutes)
app.use("/api/admin",adminRoutes)

// --- SERVIRE FRONTEND ---

// 1. Servirea fișierelor statice
// Folosim o cale absolută calculată corect
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// 2. Catch-all: Folosim un obiect RegExp direct /.*/ 
// Aceasta ocolește eroarea "PathError" din Node v24
app.get(/.*/, (req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  
  // Verificăm dacă suntem pe o rută de API care a ajuns aici din greșeală
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ error: 'API Route not found' });
  }

  res.sendFile(indexPath, (err) => {
    if (err) {
      logger.error('Eroare la trimiterea index.html:', err);
      res.status(500).send('Eroare la încărcarea paginii. Asigură-te că ai rulat npm run build în frontend.');
    }
  });
});

export default app;
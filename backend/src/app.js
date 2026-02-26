import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from '#routes/auth.routes.js';
import productRoutes from "#routes/product.routes.js"
import cartRoutes from "#routes/cart.routes.js"
import orderRoutes from "#routes/order.routes.js"
import adminRoutes from "#routes/dashboard.routes.js"

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  origin: ["http://localhost:8080",
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

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;

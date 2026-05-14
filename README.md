# Jade Intimo E‑Commerce Platform

**Jade Intimo** is a full‑stack e‑commerce web application built for a clothing and lingerie shop based in Arad, Romania. The system supports both customer‑facing storefront functionality and an administrative interface for managing products, orders, and users.

---

## 🚀 Features

### 🛍️ Customer (User) Experience

- **Product browsing** with categories, filters and subcategories
- **Search** across the catalogue
- **Responsive UI** built with React+Vite+TypeScript
- **Shopping cart** with persisted state
- **Checkout flow** supporting:
  - Stripe payments (card)
  - Pay‑on‑delivery option
- **User accounts** (signup, login, logout)
- **Order history** and status tracking
- **Concurrency protection** on order creation to avoid stock/duplicate issues
- **Client‑side caching** using Zustand for fast navigation and offline resilience
- **Password reset** via email

### 🧑‍💼 Admin Dashboard

- **Product management** (create, update, delete, variants)
- **Order management** (view, update status, concurrency-safe processing)
- **User management** (list, block/unblock)
- **Analytics/overview** panels showing sales and inventory
- **Secure admin access** protected by JWT and role checks

### 🧩 Technical Highlights

- **Dockerized** backend for development and production (`docker:prod` and Compose files)
- **Extensive logging** with [winston](https://github.com/winstonjs/winston) to `logs/combined.log`
- **Automated tests** using Jest (`backend/tests/app.test.js`)
- **Modular service architecture**: controllers, services and utilities (emails, payments, caching) are cleanly separated for maintainability
- **Concurrency control** implemented in the order service to avoid race conditions
- **Frontend caching** managed with Zustand stores
- **RBAC (role‑based access control)** ensures routes and APIs are guarded according to user roles (customer vs admin)
- **Security**
  - CORS configuration allowing cross‑origin requests only from trusted domains
  - Rate limiting middleware (`src/config/rateLimiter.js` with `apiLimiter`) to prevent abuse
  - Cookie‑based JWT authentication (`cookie-parser`, secure tokens)
  - Input validation with Zod schemas and sanitisation
  - HTTPS recommended in production
  - Headers hardening via middleware if deployed behind a proxy

### ☁️ Cloud Services

- **Neon** for PostgreSQL database (managed, serverless)
- **Railway** used to host both backend and frontend applications
- **Cloudflare** for DNS and CDN acceleration
- **Cloudflare R2** bucket used for image/file storage

### 🧠 Additional Notes

A portion of the frontend was built using **Lovable** components to expedite delivery as requested by the customer; the remainder is custom React/TypeScript.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Drizzle ORM, Zod, Winston, Jest
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Zustand, Sonner toast library
- **Database**: PostgreSQL on Neon
- **Cloud**: Railway, Cloudflare, Neon, R2
- **Authentication**: JWT stored in secure cookies
- **Payment**: Stripe SDK + pay‑on‑delivery logic
- **DevOps**: Docker, Docker Compose, environment variables

---

## 📁 Project Structure

```
/backend        # server code, tests, docker, config
/frontend       # React client (TSX + Vite)
``` 

(see workspace tree for full details)

---

## ⚙️ Running the Application

### 🔁 Same port (production‑style bundle)

```bash
# from project root
npm run build      # builds frontend into /frontend/dist
npm run start      # runs backend, serves static files from frontend
```

### 🔄 Separate ports (development)

```bash
# start frontend dev server:
npm run dev        # runs Vite from /frontend on port 5173 by default

# start backend in dockerized production mode:
npm run docker:prod
```

The backend listens on `process.env.PORT` (default 3000). The frontend client URL is configured via `CLIENT_URL` environment variable.

---

## 🔧 .env Template

Copy this template to `/backend/.env` and fill in your own values:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# PostgreSQL URL (Neon)
DATABASE_URL=postgresql://<user>:<pass>@<host>/<db>?sslmode=require

# JWT
JWT_SECRET=<your_jwt_secret>

# Neon (optional branch info for migrations)
NEON_API_KEY=<neon_api_key>
NEON_PROJECT_ID=<neon_project_id>
PARENT_BRANCH_ID=<parent_branch_id>
DELETE_BRANCH=true

# Frontend client (for CORS)
CLIENT_URL=http://localhost:3000

# Stripe
STRIPE_API_KEY=<stripe_secret_key>

# Cloudflare R2 credentials
R2_ACCOUNT_ID=<account_id>
R2_ACCESS_KEY_ID=<access_key>
R2_SECRET_ACCESS_KEY=<secret_key>
R2_BUCKET_NAME=<bucket_name>
PUBLIC_IMAGE_DOMAIN=<r2_public_domain>

# Email (for order confirmations, resets)
EMAIL_APP_PASSWORD=<app_password>
EMAIL_USERNAME=<email_address>
```

*Do not commit `.env` to version control.*

---

## ✅ Testing

Run backend unit tests with:

```bash
cd backend
npm test
```

---

## 🎯 Deployment

The project is designed to deploy easily with Docker or directly on Railway (GitHub integration). Ensure environment variables are set in the host environment and that Cloudflare DNS records point to the Railway-provided domains.

---

## 🙌 Credits

Built by Alex Rădulescu for a retail clothing & lingerie business in **Arad, Romania**. Includes both customer and admin workflows, with a focus on reliability, scalability, and security.

---

Thank you for exploring Jade Intimo!
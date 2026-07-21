
<div align="center">

# 🛍️ AdvanceBackend Ecommerce API

**A production-style e-commerce backend** built with Express 5, TypeScript, and Prisma.
Layered architecture · JWT auth · Role-based access · Redis rate limiting · Cloudinary uploads

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🧰 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📡 API Reference](#-api-reference)
- [🗃️ Data Model](#️-data-model)
- [🛡️ Rate Limiting](#️-rate-limiting)
- [👤 Author](#-author)

---

## ✨ Features

| | |
|---|---|
| 🔐 **Auth** | Register/login, access + refresh token rotation, logout from one or all devices |
| 🧑‍⚖️ **RBAC** | `USER`, `SELLER`, `ADMIN` roles enforced per route |
| 📦 **Products** | Create/update/delete (seller-only), multi-image upload via Multer + Cloudinary, pagination, active/inactive toggle |
| 🗂️ **Categories** | Full CRUD, admin/seller-gated writes |
| 🛒 **Cart** | Add, update quantity, remove item, clear cart |
| 📬 **Orders** | Create from cart, view own orders, cancel, admin status updates |
| 🏠 **Addresses** | Full CRUD for a user's shipping addresses |
| 🚦 **Rate Limiting** | Redis-backed limiters — global, auth, product, and per-role tiers |
| ✅ **Validation** | Zod-based request validation + centralized error handling |

---

## 🧰 Tech Stack

<div align="center">

| Layer | Technology |
|:---|:---|
| **Runtime** | Node.js (TypeScript, ESM) |
| **Framework** | Express 5 |
| **Database** | PostgreSQL via Prisma ORM |
| **Cache / Rate Limiting** | Redis (`ioredis` + `rate-limit-redis`) |
| **Auth** | JWT (access + refresh tokens), bcrypt |
| **File Uploads** | Multer + Cloudinary |
| **Validation** | Zod |

</div>

---

## 📂 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Data model (User, Product, Category, Order, Cart, Address...)
│   └── migrations/
└── src/
    ├── app.ts                 # Express app, middleware, route mounting
    ├── index.ts               # Server entrypoint
    ├── config/                # Env config
    ├── constants/             # Rate-limit & time constants
    ├── lib/                   # Prisma, Redis, Cloudinary clients
    ├── middleware/             # Auth, validation, rate limiting, error handling, multer
    ├── modules/
    │   ├── auth/
    │   ├── product/
    │   ├── category/
    │   ├── cart/
    │   ├── order/
    │   └── address/
    │       # each module: route → controller → service → repository
    │       # plus schema (Zod), interface, mapper, container
    ├── types/
    └── utils/                  # AppError, CatchAsync, JWT/auth helpers, cursor pagination...
```

---

## 🚀 Getting Started

### Prerequisites

- 🟢 Node.js 18+
- 🐘 PostgreSQL database
- 🔴 Redis instance
- ☁️ Cloudinary account (for image uploads)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/dndmein-rgb/AdvanceBackend-Ecommerce-Api.git
cd AdvanceBackend-Ecommerce-Api/backend
npm install
```

### 2️⃣ Configure Environment

Create a `.env` file inside `backend/`:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_db

FRONTEND_URL=http://localhost:3000

JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_ACCESS_TOKEN_EXPIRY=15m

JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3️⃣ Set Up the Database

```bash
npm run db:generate   # generate Prisma client
npm run db:migrate    # run migrations
```

### 4️⃣ Run It

```bash
npm run dev     # 🔥 dev server with hot reload (tsx watch)
npm run build   # 🏗️  compile TypeScript
npm start       # ▶️  run compiled build
```

> Server starts on `http://localhost:<PORT>` 🎉

---

## 📡 API Reference

**Base URL:** `/api/v1`
**Utility:** `GET /health-check` · `GET /ip`

<details>
<summary>🔐 <b>Auth</b> — <code>/api/v1/auth</code></summary><br>

| Method | Endpoint | Access |
|:---|:---|:---|
| `POST` | `/register` | Public 🚦 |
| `POST` | `/login` | Public 🚦 |
| `GET` | `/me` | 🔒 Authenticated |
| `POST` | `/logout` | Public |
| `POST` | `/logout-all` | 🔒 Authenticated |
| `POST` | `/refresh-token` | Public 🚦 |

</details>

<details>
<summary>📦 <b>Products</b> — <code>/api/v1/product</code></summary><br>

| Method | Endpoint | Access |
|:---|:---|:---|
| `GET` | `/all-products` | 🛡️ Admin |
| `GET` | `/active` | Public |
| `GET` | `/category/:slug` | Public |
| `POST` | `/` | 🏪 Seller · image upload (≤5) |
| `PATCH` | `/update-product/:productId` | 🏪 Seller |
| `PATCH` | `/:productId/toggle` | 🏪 Seller |
| `DELETE` | `/:id` | 🏪 Seller |

</details>

<details>
<summary>🗂️ <b>Categories</b> — <code>/api/v1/category</code></summary><br>

| Method | Endpoint | Access |
|:---|:---|:---|
| `GET` | `/all-category` | Public |
| `GET` | `/:categoryId` | 🔒 Authenticated |
| `POST` | `/create` | 🛡️ Admin |
| `PATCH` | `/update/:categoryId` | 🛡️ Admin |
| `DELETE` | `/delete/:categoryId` | 🛡️ Admin, 🏪 Seller |

</details>

<details>
<summary>🛒 <b>Cart</b> — <code>/api/v1/cart</code></summary><br>

| Method | Endpoint | Access |
|:---|:---|:---|
| `GET` | `/` | 🔒 Authenticated |
| `POST` | `/items` | 🔒 Authenticated |
| `PATCH` | `/items/:cartItemId` | 🔒 Authenticated |
| `DELETE` | `/items/delete/:cartItemId` | 🔒 Authenticated |
| `DELETE` | `/delete` | 🔒 Authenticated |

</details>

<details>
<summary>📬 <b>Orders</b> — <code>/api/v1/order</code></summary><br>

| Method | Endpoint | Access |
|:---|:---|:---|
| `POST` | `/create` | 🔒 Authenticated |
| `GET` | `/` | 🔒 Authenticated (own orders) |
| `GET` | `/:orderId` | 🔒 Authenticated |
| `PATCH` | `/:orderId/cancel` | 🔒 Authenticated |
| `PATCH` | `/:orderId/status` | 🛡️ Admin |

</details>

<details>
<summary>🏠 <b>Addresses</b> — <code>/api/v1/address</code></summary><br>

| Method | Endpoint | Access |
|:---|:---|:---|
| `POST` | `/create` | 🔒 Authenticated |
| `GET` | `/getme` | 🔒 Authenticated |
| `GET` | `/:addressId` | 🔒 Authenticated |
| `PATCH` | `/update/:addressId` | 🔒 Authenticated |
| `DELETE` | `/delete/:addressId` | 🔒 Authenticated |

</details>

---

## 🗃️ Data Model

Core entities, defined in [`prisma/schema.prisma`](backend/prisma/schema.prisma):

```
User ─┬─ Address[]
      ├─ RefreshToken[]
      ├─ Product[]        (as seller)
      ├─ Order[] ─┬─ OrderItem[] ─── Product
      │           └─ OrderAddress
      └─ Cart ──── CartItem[] ─── Product

Category ──── Product[]
```

- Roles: `USER` · `SELLER` · `ADMIN`
- Orders snapshot the shipping address and per-item purchase price at checkout
- Products are indexed for pagination, category filtering, and active-status filtering

---

## 🛡️ Rate Limiting

All limiters are Redis-backed, so limits are shared consistently across instances:

| Limiter | Scope | Window | Limit |
|:---|:---|:---|:---|
| 🌍 Global | Per IP | 15 min | 100 requests |
| 🔑 Auth | Per IP | 1 min | 5 requests |
| 📦 Product | Per user | 1 min | 30 requests |
| 👤 Per-role | Per user | 15 min | 200 (USER) / 500 (SELLER) / 1000 (ADMIN) |

---

## 👤 Author

**Divyanshu Rathore**
[![GitHub](https://img.shields.io/badge/GitHub-dndmein--rgb-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/dndmein-rgb)

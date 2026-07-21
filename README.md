# 🛒 Advanced E-Commerce REST API Backend

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=json-web-tokens)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A robust, scalable, and feature-rich RESTful API built for modern E-Commerce applications. Designed with scalable backend architecture, role-based access control (RBAC), secure authentication, shopping cart and checkout flows, order processing, and payment gateway integration ready.

---

## 🌟 Key Features

### 🔐 Authentication & Authorization
- **JWT-Based Security:** Access & Refresh Token rotation strategy.
- **Role-Based Access Control (RBAC):** Distinct permissions for `User`, `Seller/Vendor`, and `Admin`.
- **Password Security:** Salted password hashing with `bcryptjs`.
- **Account Verification & Reset:** Email OTP / Token-based password recovery.

### 📦 Product & Category Management
- **Full CRUD Support:** Create, read, update, and soft-delete products.
- **Advanced Filtering & Search:** Filter by category, price range, brand, rating, and keywords.
- **Pagination & Sorting:** Efficient database querying with page size and sort controls.
- **Variants & Inventory:** Support for product colors, sizes, SKU, and stock count tracking.
- **Media Storage:** Cloudinary/S3 integration for product image uploads.

### 🛒 Cart & Wishlist
- **Persistent Cart:** Add, update quantities, remove items, or clear cart.
- **Wishlist Support:** Save items for later with one-click transfers to cart.
- **Real-Time Stock Checks:** Prevents ordering items exceeding available stock.

### 💳 Orders & Payments
- **Order Lifecycle:** Pending -> Processing -> Shipped -> Delivered -> Cancelled.
- **Address Management:** Multiple shipping & billing address support per user.
- **Payment Gateway Integration:** Stripe / Razorpay Webhooks and payment intent processing.
- **Invoice Generation:** Automated order summary and transaction logging.

### 🛡️ Admin Dashboard Backend
- User & Vendor management.
- Sales analytics and order summaries.
- Product approval and inventory management.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime Environment** | Node.js (v18+) |
| **Web Framework** | Express.js |
| **Database & ODM** | MongoDB with Mongoose |
| **Authentication** | JSON Web Tokens (JWT) & Cookies |
| **FileUploads** | Multer & Cloudinary / AWS S3 |
| **Validation** | Joi / Express-Validator |
| **Security Middlewares** | Helmet, CORS, Rate Limiting, Mongo Sanitize |

---

## 📁 Repository Structure

```text
AdvanceBackend-Ecommerce-Api/
├── config/             # Database connection, Cloudinary, Payment gateway configs
├── controllers/        # Request handlers & core business logic
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── userController.js
├── middleware/         # Auth verification, RBAC, error handling, file upload
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── uploadMiddleware.js
├── models/             # Mongoose schemas (User, Product, Order, Cart, Category)
├── routes/             # Express API Route definitions
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── utils/              # Helper functions (JWT signers, email senders, API features)
├── .env.example        # Environment variables template
├── server.js           # Application entry point
└── package.json

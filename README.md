# 🥗 Papaya Salad Shop - E-Commerce Platform

**DDBMS Term Project**  
A full-stack web application for ordering Thai papaya salad (Som Tam) online, built with modern web technologies and MongoDB as the NoSQL database.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Demo](#demo)

---

## 🎯 Overview

This project demonstrates the implementation of a distributed NoSQL database system using MongoDB Atlas for a real-world e-commerce application. The platform allows customers to browse various papaya salad options, manage their shopping cart, place orders, and track order status.

**Course:** Distributed Database Management Systems (DDBMS)  
**Database:** MongoDB (NoSQL - Document-based)  
**Deployment:** MongoDB Atlas (Cloud Database)

---

## ✨ Features

### User Management

- ✅ User registration and authentication
- ✅ Secure login/logout functionality
- ✅ Session management

### Product Catalog

- ✅ Browse multiple papaya salad varieties
- ✅ View detailed product information and images
- ✅ Real-time product availability

### Shopping Cart

- ✅ Add/remove items from cart
- ✅ Adjust quantities
- ✅ Real-time cart total calculation
- ✅ Persistent cart storage

### Order Management

- ✅ Place orders with automatic total calculation
- ✅ View order history
- ✅ Track order status (Pending, Completed, Cancelled)
- ✅ Update order status
- ✅ Cancel orders

---

## 🛠 Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client

### Backend

- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing

### Database

- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - ODM (Object Data Modeling)

### Development Tools

- **ts-node** - TypeScript execution
- **ESLint** - Code linting
- **dotenv** - Environment variables

---

## 🏗 System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Next.js Client │ ◄─────► │  Express API    │ ◄─────► │  MongoDB Atlas  │
│  (Port 3000)    │  HTTP   │  (Port 3001)    │  CRUD   │  (Cloud)        │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## 💾 Database Design

### Collections

#### 1. **Users Collection**

```javascript
{
  _id: ObjectId,
  username: String (unique),
  password: String,
  createdAt: Date
}
```

#### 2. **Products Collection**

```javascript
{
  _id: ObjectId,
  name: String,
  price: Number,
  description: String,
  image: String,
  createdAt: Date
}
```

#### 3. **Orders Collection**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  status: String (enum: ['pending', 'completed', 'cancelled']),
  createdAt: Date
}
```

### MongoDB Advantages Demonstrated

- **Flexible Schema**: Easy to add new product fields without migrations
- **Document Model**: Natural representation of orders with embedded items
- **Scalability**: MongoDB Atlas provides automatic scaling
- **Rich Queries**: Support for complex filtering and aggregation
- **JSON-like Documents**: Perfect fit for JavaScript/TypeScript stack

---

## 📦 Installation

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd firstProjectWithNoSQL
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/papaya-shop
```

### 5. Seed the Database

```bash
cd server
npx ts-node seed.ts
```

---

## 🚀 Usage

### Start the Backend Server

```bash
cd server
npm run dev
```

Server runs at: `http://localhost:3001`

### Start the Frontend Client

```bash
cd client
npm run dev
```

Client runs at: `http://localhost:3000`

### Test Credentials

After seeding the database, you can login with:

- Username: `testuser` / Password: `testpass123`
- Username: `demo` / Password: `demo123`

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | User login        |

### Product Routes (`/api/products`)

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/products`     | Get all products   |
| GET    | `/api/products/:id` | Get single product |

### Order Routes (`/api/orders`)

| Method | Endpoint                      | Description         |
| ------ | ----------------------------- | ------------------- |
| POST   | `/api/orders`                 | Create new order    |
| GET    | `/api/orders/user/:userId`    | Get user's orders   |
| PATCH  | `/api/orders/status/:orderId` | Update order status |
| DELETE | `/api/orders/delete/:orderId` | Cancel/delete order |

---

## 📁 Project Structure

```
firstProjectWithNoSQL/
│
├── client/                    # Frontend (Next.js)
│   ├── app/
│   │   ├── api/              # API route handlers
│   │   ├── cart/             # Shopping cart page
│   │   ├── login/            # Login page
│   │   ├── orders/           # Orders page
│   │   ├── register/         # Registration page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home/products page
│   ├── public/
│   │   └── images/           # Product images
│   ├── lib/                  # Utility functions
│   ├── package.json
│   └── tsconfig.json
│
├── server/                    # Backend (Express)
│   ├── models/
│   │   ├── User.ts           # User model
│   │   ├── Product.ts        # Product model
│   │   └── Order.ts          # Order model
│   ├── routes/
│   │   ├── auth.ts           # Auth routes
│   │   ├── products.ts       # Product routes
│   │   └── orders.ts         # Order routes
│   ├── index.ts              # Server entry point
│   ├── seed.ts               # Database seeder
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                  # This file
```

---

## 🎥 Demo

### Product Menu

Browse through various papaya salad options with detailed descriptions and prices.

### Shopping Cart

Add items to cart, adjust quantities, and view total price before checkout.

### Order Management

Place orders, view order history, and track order status in real-time.

---

## 🎓 Learning Outcomes

This project demonstrates:

1. **NoSQL Database Design** - Schema-less document model with MongoDB
2. **Distributed Systems** - Cloud-based database (MongoDB Atlas)
3. **RESTful API Design** - CRUD operations with Express
4. **Full-Stack Integration** - Next.js frontend with Express backend
5. **Data Modeling** - Relationships using references and embedded documents
6. **Scalability** - Cloud infrastructure ready for production

---

## 📝 License

This project is created for educational purposes as part of the DDBMS course.

---

## 👨‍💻 Author

**PHOO**  
JECTINUNIVERZITY - DDBMS Term Project

---

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database hosting
- Next.js and React teams for excellent frameworks
- Express.js for the robust backend framework

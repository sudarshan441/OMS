# 🧠 High-Level Design Document – Igniflo OMS (MERN Stack)

## 🏗️ Architecture Overview

### 🔄 Separation of Concerns

- **Client (Next.js)**: Handles UI and Socket.IO client
- **API Server (Express.js)**: Manages business logic and WebSocket events
- **Database (MongoDB)**: Stores all data in collections

## 🔁 Request Flow

1. User places order via `/order`
2. Backend locks inventory, creates customer/order
3. Response sent back with Order ID

## 🌐 Real-Time Flow

- Backend emits `orderPlaced` and `orderStatusUpdated` via Socket.IO
- Clients subscribe to those events

## 🧩 Component Breakdown

- **Pages**: `/order`, `/track-order/:id`, `/admin`
- **Shared Components**: Form, Table, Status Badge, CSV Export
- **State**: Context API or Zustand (optional)

## 🗃️ Database Schema

### ER Model

- **User**: name, email, password, role
- **Customer**: name, email
- **Product**: name, price, stock
- **Order**: customer, items[], paymentCollected, status

### Indexing Strategy

| Collection | Index |
|------------|--------|
| users      | email (unique) |
| customers  | email (unique) |
| products   | name (text)    |
| orders     | customer, status |

## 📡 API Contract

| Endpoint             | Method | Auth | Description              |
|----------------------|--------|------|--------------------------|
| /auth/register       | POST   | ❌   | Register new user        |
| /auth/login          | POST   | ❌   | Login and get JWT        |
| /api/orders          | POST   | ✅   | Place order              |
| /api/orders/:id      | GET    | ❌   | Get order by ID          |
| /api/orders/:id/status | PUT | ✅   | Update order status      |
| /api/orders/export/csv | GET | ✅   | Export orders to CSV     |
| /api/products        | GET/POST | ✅ | List or create products  |
| /api/customers       | GET/POST | ✅ | List or create customers |

## 📤 Sequence – Place Order

1. UI sends POST /api/orders
2. Backend checks stock and customer
3. Order is created, stock is reserved
4. WebSocket event is emitted

## ☁️ Deployment Topology

| Component | Platform |
|-----------|----------|
| Client    | Vercel   |
| API       | Railway  |
| DB        | Railway Mongo |

## 🔐 Security & Observability

- Auth: JWT + Role-Based Access
- Rate Limiting: express-rate-limit
- Headers: Helmet
- Logging: Pino
- Error Tracking: Sentry (optional)
- Health: `/healthz`

## 🛠️ DB Setup

- Seed via `node seed.js`
- Referential integrity via Mongoose population
- Indexes via schema `.index()` method

## 🖼️ UI Design

- Built with `shadcn/ui`
- Responsive, form-based dashboard
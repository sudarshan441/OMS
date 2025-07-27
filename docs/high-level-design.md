# 🧠 High-Level Design Document – Igniflo Order Management System (MERN Stack)

---

## 🏗️ Architecture Overview

### 🔄 Separation of Concerns

| Layer       | Tech Used         | Responsibility                                      |
|-------------|-------------------|-----------------------------------------------------|
| Frontend    | Next.js (App Router) + shadcn/ui | User Interface (Admin + Customer), API calls, WebSocket events |
| Backend     | Express.js + Socket.IO           | REST API, auth, business logic, real-time events     |
| Database    | MongoDB (via Mongoose)           | Stores Users, Customers, Products, Orders            |

---

## 🔁 Request Flow (HTTP)

1. User places order via `/place-order`
2. Client sends POST request to `/api/orders`
3. Server:
   - Validates customer and inventory
   - Creates new customer if not found
   - Reserves inventory
   - Creates order
4. Sends response with `orderId`
5. Frontend redirects user to `/track-order/:id`

---

## 📡 Real-Time Flow (WebSocket via Socket.IO)

- Admin Dashboard connects to WebSocket on mount
- When a new order is placed:
  - Backend emits `orderPlaced`
  - All connected clients receive update (admin UI re-renders)
- When order status is updated:
  - Backend emits `orderStatusUpdated`
  - Admin and tracking UI update accordingly

---

## 🧩 Component Breakdown

### Client

| Page               | Purpose                            |
|--------------------|-------------------------------------|
| `/login`           | Admin authentication                |
| `/register`        | Admin registration (optional)       |
| `/admin`           | Admin dashboard with filtering, updates |
| `/place-order`     | Customer places order               |
| `/track-order/:id` | Customer checks order status        |

### Shared Components

- `Navbar`, `ProtectedRoute`, `Form`, `StatusBadge`, `Card`, `Input`, `Button`, `CSVExportButton`

### State Management

- React `Context API` for Auth
- `useState` / `useEffect` for local state
- WebSocket events using `socket.io-client`

---

## 🗃️ Database Schema (ERD)

### 📦 Collections

#### User

- `name`: String
- `email`: String (unique)
- `password`: Hashed
- `role`: `admin` or `customer`

#### Customer

- `name`, `email`

#### Product

- `name`
- `price`
- `stock`

#### Order

- `customer` → references `Customer`
- `items`: Array of `{ product, quantity }`
- `status`: Enum (`PENDING`, `PAID`, `FULFILLED`, `CANCELLED`)
- `paymentCollected`: Boolean

### 🧮 Indexing Strategy

| Collection | Index Fields        |
|------------|---------------------|
| `users`    | `email` (unique)    |
| `customers`| `email` (unique)    |
| `products` | `name` (text)       |
| `orders`   | `customer`, `status`|

---

## 📡 API Contract

| Endpoint                      | Method | Auth | Description                       |
|-------------------------------|--------|------|-----------------------------------|
| `/auth/register`             | POST   | ❌   | Register a new user               |
| `/auth/login`                | POST   | ❌   | Login and receive JWT             |
| `/api/orders`                | GET    | ✅   | List all orders (admin)           |
| `/api/orders`                | POST   | ❌   | Place a customer order            |
| `/api/orders/:id`            | GET    | ❌   | Get order by ID                   |
| `/api/orders/:id/status`     | PUT    | ✅   | Update order status (admin)       |
| `/api/orders/export/csv`     | GET    | ✅   | Export orders to CSV (admin)      |
| `/api/products`              | GET    | ✅   | List products                     |
| `/api/products`              | POST   | ✅   | Create product                    |
| `/api/customers`             | GET    | ✅   | List customers                    |
| `/api/customers`             | POST   | ✅   | Create customer                   |
| `/healthz`                   | GET    | ❌   | Health check                      |

---

## 📤 Sequence Diagram – Place Order

### Description

From button click → order creation → real-time update to admin

1. User submits order form → `POST /api/orders`
2. Server:
   - Validates and finds/creates customer
   - Checks and reserves stock
   - Saves order
3. Emits `orderPlaced` WebSocket event
4. Admin dashboard receives real-time update
5. Response returns `orderId` → Client redirects to `/track-order/:id`

*Diagram Recommendation:* Use [https://sequencediagram.org/](https://sequencediagram.org/) to visualize

---

## ☁️ Deployment Topology

| Component | Platform | Description                           |
|----------|----------|---------------------------------------|
| Frontend | Vercel   | Automatically deployed via GitHub Actions |
| Backend  | Render   | Node.js Express API + WebSocket + DB |
| MongoDB  | Atlas    | Persistent database storage       |

---

## 🔐 Security & Observability

### Security

- JWT authentication with role-based access
- Route protection with middleware (`auth`)
- Rate limiting (e.g., `express-rate-limit`)
- Secure headers (`helmet`)
- CORS configured

### Observability

- Logging: `pino`
- Error monitoring: Sentry (optional)
- Health endpoint: `/healthz`

---

## 🛠️ Database Setup

- Mongoose schema definitions with `.index()`
- Referential integrity with `.populate()`
- Seeding script: `node seed.js`
- Can be tested with Postman or Insomnia

---

## 🎨 UI Design

- Built with `shadcn/ui` and TailwindCSS
- Mobile-first responsive design
- Components: Form, Inputs, Dashboard table, Status badges, CSV Export
- Reusable layout in `app/layout.js`

---

## 🧪 Testing

- Manual test cases for all major flows
- Future scope: integrate Jest + Supertest for API testing

---

## ✅ Done & Delivered

- [x] Role-based login
- [x] Customer order placement
- [x] Real-time admin updates
- [x] Track order by ID
- [x] CSV export for reporting
- [x] Responsive UI
- [x] Health check + rate limiting
- [x] CI/CD on both frontend (Vercel) and backend (Render)

---


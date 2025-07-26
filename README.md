# 🛠️ Igniflo Order Management System (MERN Stack)

A full-stack order management system built using:

- **Frontend**: Next.js + shadcn/ui
- **Backend**: Express.js + MongoDB + Socket.IO
- **Auth**: JWT Role-Based Access (Admin/Customer)
- **Deployment**: Vercel (client) + Railway (server)
- **CI/CD**: GitHub Actions

## 📦 Features

- Customer order placement and tracking
- Admin dashboard for managing orders
- Real-time order status updates
- Role-based access control (admin only)
- Secure APIs with rate-limiting and Helmet
- Logging (Pino), health checks, and optional Sentry integration
- CSV export for reporting

## 🚀 Getting Started

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup (Coming Soon)

```bash
cd client
npm install
npm run dev
```

## 🧪 Testing

```bash
cd server
npm test
```

## 🛡️ Environment Variables (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/igniflo-oms
JWT_SECRET=your_jwt_secret
SENTRY_DSN=optional_sentry_dsn
```

## ⚙️ Common Commands

| Command             | Description              |
|---------------------|--------------------------|
| `npm run dev`       | Run server in dev mode   |
| `npm test`          | Run backend tests        |
| `node seed.js`      | Seed DB with sample data |

## ☁️ Deployment

- Frontend: [Vercel](https://vercel.com)
- Backend: [Railway](https://railway.app)
- MongoDB: Railway Mongo Plugin or Atlas

CI/CD runs lint/test/deploy via GitHub Actions.

## 📚 Documentation

- [`docs/high-level-design.md`](./docs/high-level-design.md)
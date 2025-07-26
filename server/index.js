const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const logger = require('./logger');
const Sentry = require('@sentry/node');

dotenv.config();
Sentry.init({ dsn: process.env.SENTRY_DSN });
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT']
  }
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
app.use(Sentry.Handlers.requestHandler());
app.use(helmet());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests
    message: 'Too many requests from this IP, please try again later'
}));

app.use(cors());
app.use(express.json());

app.use(Sentry.Handlers.errorHandler());
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/healthz', healthRoutes);

// Example route
app.get('/', (req, res) => res.send('API is running'));

// Socket.IO setup
io.on('connection', (socket) => {
  logger.info(`⚡ User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`❌ User disconnected: ${socket.id}`);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  server.listen(PORT, () => logger.info(`Server running on http://localhost:${PORT}`));
})
.catch(err => logger.info(err));

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OrderController = require('../controllers/OrderController');

router.post('/', auth(['CUSTOMER', 'ADMIN']), OrderController.createOrder);
router.get('/', auth(['ADMIN']), OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id/status', auth(['ADMIN']), OrderController.updateOrderStatus);
router.get('/export/csv', auth(['ADMIN']), OrderController.exportOrdersCsv);

module.exports = router;
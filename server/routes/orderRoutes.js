const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OrderController = require('../controllers/orderController');

router.post('/', OrderController.createOrder);
router.get('/', auth(['admin']), OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id/status', auth(['admin']), OrderController.updateOrderStatus);
router.get('/export/csv', auth(['admin']), OrderController.exportOrdersCsv);

module.exports = router;
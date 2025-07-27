const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers } = require('../controllers/customerController');
const auth = require('../middleware/auth');

router.post('/', createCustomer);
router.get('/',auth(['admin']), getCustomers);

module.exports = router;

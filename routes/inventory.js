const express = require('express');
const router = express.Router();
const inventory = require('../Controllers/inventory');

router.get('/inventory/:user_id', inventory.getUserInventory);
router.post('/inventory/buy', inventory.buyItem);

module.exports = router;

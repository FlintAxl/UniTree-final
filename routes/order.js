const express = require('express');
const router = express.Router();
const order = require('../controllers/order');

// Existing routes
router.post('/order', order.createOrder);
router.get('/my-orders/:user_id', order.getCustomerOrders);
router.patch('/cancel-order', order.cancelOrder);

// New routes for seller order management
router.get('/seller/:sellerId/orders', order.getSellerOrders);
router.put('/orders/:orderId/status', order.updateOrderStatusSeller);

// Notification routes
router.get('/orders/user/:userId/notifications', order.getUserNotifications);
router.put('/orders/user/:userId/notifications/mark-read', order.markNotificationsAsRead);

// Coins and rewards routes
router.get('/my-rewards/:user_id', order.getUserRewards);
router.get('/my-discounts/:user_id', order.getUserDiscounts);
router.post('/trade-discount', order.tradeDiscount);

module.exports = router;
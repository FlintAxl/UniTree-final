const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/review');

// Get items from an order to review
router.get('/order-items/:order_id', reviewController.getProductsByOrder);

// Create reviews
router.post('/reviews', reviewController.createReviews);

// Admin
router.get('/reviews/all', reviewController.getAllReviews);
router.delete('/reviews/:review_id', reviewController.deleteReview);
// Get reviews for a specific product
router.get('/products/:product_id/reviews', reviewController.getProductReviews);

// Get all reviews by a user
router.get('/users/:user_id/reviews', reviewController.getUserReviews);

// Update a review
router.put('/reviews/:review_id', reviewController.updateReview);

module.exports = router;

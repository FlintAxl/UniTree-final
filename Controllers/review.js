// controllers/review.js
const connection = require('../config/database');

// Get products in an order with existing reviews by the user
exports.getProductsByOrder = (req, res) => {
  const orderId = req.params.order_id;
  const userId = req.query.user_id; // from query

  const sql = `
    SELECT 
      p.product_id, p.name AS product_name,
      oi.quantity, oi.price,
      r.rating, r.comment
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    LEFT JOIN reviews r
      ON r.product_id = p.product_id
      AND r.order_id = oi.order_id
      AND r.user_id = ?
    WHERE oi.order_id = ?
  `;

  connection.query(sql, [userId, orderId], (err, results) => {
    if (err) {
      console.error('Error fetching order products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.status(200).json({ data: results });
  });
};

// Create multiple reviews at once
exports.createReviews = (req, res) => {
  const reviews = req.body.reviews; // Array of { user_id, product_id, order_id, rating, comment }

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return res.status(400).json({ error: 'No reviews provided' });
  }

  const sql = `
    INSERT INTO reviews (user_id, product_id, order_id, rating, comment, created_at)
    VALUES ?
  `;

  const values = reviews.map(r => [
    r.user_id,
    r.product_id,
    r.order_id,
    r.rating,
    r.comment,
    new Date()
  ]);

  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Review insert error:', err);
      return res.status(500).json({ error: 'Error inserting reviews', details: err });
    }

    res.status(201).json({ message: 'Reviews submitted', inserted: result.affectedRows });
  });
};

// Get all reviews
exports.getAllReviews = (req, res) => {
  const sql = `
    SELECT r.review_id, r.rating, r.comment, r.created_at,
           u.username AS user_name,
           p.name AS product_name,
           r.order_id
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    JOIN products p ON r.product_id = p.product_id
    ORDER BY r.created_at DESC
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
    res.json({ data: results });
  });
};

// Delete a review
exports.deleteReview = (req, res) => {
  const { review_id } = req.params;
  const sql = `DELETE FROM reviews WHERE review_id = ?`;

  connection.query(sql, [review_id], (err, result) => {
    if (err) {
      console.error('Error deleting review:', err);
      return res.status(500).json({ error: 'Failed to delete review' });
    }
    res.json({ message: 'Review deleted' });
  });
};

// Get reviews for a specific product
exports.getProductReviews = (req, res) => {
  const { product_id } = req.params;

  const sql = `
    SELECT 
      r.review_id,
      r.rating,
      r.comment,
      r.created_at,
      u.username,
      u.profile_picture
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.product_id = ? 
      AND r.deleted_at IS NULL
    ORDER BY r.created_at DESC
  `;

  connection.query(sql, [product_id], (err, results) => {
    if (err) {
      console.error('Error fetching product reviews:', err);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
    
    // Calculate average rating
    const avgRating = results.length > 0 
      ? results.reduce((sum, r) => sum + r.rating, 0) / results.length 
      : 0;
    
    res.json({ 
      success: true,
      data: results,
      count: results.length,
      averageRating: avgRating.toFixed(1)
    });
  });
};

// Get all reviews by a specific user
exports.getUserReviews = (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT 
      r.review_id,
      r.rating,
      r.comment,
      r.created_at,
      r.product_id,
      p.name AS product_name,
      (SELECT image_path FROM product_images WHERE product_id = p.product_id LIMIT 1) AS product_image
    FROM reviews r
    JOIN products p ON r.product_id = p.product_id
    WHERE r.user_id = ? 
      AND r.deleted_at IS NULL
    ORDER BY r.created_at DESC
  `;

  connection.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching user reviews:', err);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
    
    res.json({ 
      success: true,
      data: results,
      count: results.length
    });
  });
};

// Update a review
exports.updateReview = (req, res) => {
  const { review_id } = req.params;
  const { rating, comment } = req.body;

  const sql = `
    UPDATE reviews 
    SET rating = ?, comment = ?, updated_at = NOW()
    WHERE review_id = ?
  `;

  connection.query(sql, [rating, comment, review_id], (err, result) => {
    if (err) {
      console.error('Error updating review:', err);
      return res.status(500).json({ error: 'Failed to update review' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ success: true, message: 'Review updated successfully' });
  });
};
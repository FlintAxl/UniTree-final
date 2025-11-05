const express = require('express');
const router = express.Router();
const { verifyToken } = require('../Middlewares/auth');
const connection = require('../config/database');

// Get cart count
router.get('/count', verifyToken, (req, res) => {
    const userId = req.user.user_id;
    
    const sql = 'SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?';
    connection.execute(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error getting cart count:', err);
            return res.status(500).json({ error: 'Failed to get cart count' });
        }
        res.json({ count: results[0].count || 0 });
    });
});

// Add item to cart
router.post('/add/:productId', verifyToken, (req, res) => {
    const userId = req.user.user_id;
    const productId = req.params.productId;
    
    const sql = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1';
    connection.execute(sql, [userId, productId], (err, result) => {
        if (err) {
            console.error('Error adding to cart:', err);
            return res.status(500).json({ error: 'Failed to add item to cart' });
        }
        
        // Get updated cart count
        const countSql = 'SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?';
        connection.execute(countSql, [userId], (err, results) => {
            if (err) {
                console.error('Error getting cart count:', err);
                return res.status(500).json({ error: 'Failed to get cart count' });
            }
            
            res.json({ 
                success: true, 
                count: results[0].count || 0 
            });
        });
    });
});

// Remove item from cart
router.delete('/remove/:productId', verifyToken, (req, res) => {
    const userId = req.user.user_id;
    const productId = req.params.productId;
    
    const sql = 'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?';
    connection.execute(sql, [userId, productId], (err, result) => {
        if (err) {
            console.error('Error removing from cart:', err);
            return res.status(500).json({ error: 'Failed to remove item from cart' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }
        
        // Get updated cart count
        const countSql = 'SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?';
        connection.execute(countSql, [userId], (err, results) => {
            if (err) {
                console.error('Error getting cart count:', err);
                return res.status(500).json({ error: 'Failed to get cart count' });
            }
            
            res.json({ 
                success: true, 
                count: results[0].count || 0 
            });
        });
    });
});

module.exports = router;
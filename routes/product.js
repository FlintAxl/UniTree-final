const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const upload = require('../utils/multer');
const authMiddleware = require('../Middlewares/auth');
const { 
  getAllProducts,
  getSellerProducts,
  getSingleProduct,
  createProduct,     // seller
  updateProduct,     // seller
  deleteProduct,     // seller
  addProduct,        // seller (simplified)
  getAllCategories,
  createAdminProduct, // admin
  updateAdminProduct, // admin
  deleteAdminProduct  // admin
} = require('../Controllers/product');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if user is a seller
const verifySeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ error: 'Access denied. Sellers only.' });
  }
  next();
};

// Middleware to check if user is an admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

// ==========================
// Public routes
// ==========================
router.get('/products', getAllProducts);
router.get('/products/:id', getSingleProduct);
router.get('/categories', getAllCategories);


// Admin product management
router.get('/products/admin/:id',authMiddleware, verifyToken, verifyAdmin, getSingleProduct);
router.post('/products/admin',authMiddleware, verifyToken, verifyAdmin, upload.array('image', 10), createAdminProduct);
router.put('/products/admin/:id',authMiddleware, verifyToken, verifyAdmin, upload.array('image', 10), updateAdminProduct);
router.delete('/products/admin/:id',authMiddleware, verifyToken, verifyAdmin, deleteAdminProduct);


// ==========================
// Seller-specific routes
// ==========================
router.get('/products/seller/:sellerId', verifyToken, verifySeller, getSellerProducts);
router.post('/products/seller/:sellerId', verifyToken, verifySeller, upload.array('images', 10), addProduct);
router.put('/products/seller/:sellerId/:id', verifyToken, verifySeller, upload.array('images', 10), updateProduct);
router.delete('/products/seller/:sellerId/:id', verifyToken, verifySeller, deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');

const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserProfile, 
  updateUserProfile,
  getSecurityInfo,
  changePassword,
  getSellerAnalytics  // Add this new function
} = require('../Controllers/user');

const petController = require('../Controllers/pet');

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);

router.get('/security/:id', getSecurityInfo);
router.put('/change-password/:id', changePassword);

router.post('/pets', petController.createPetForUser);

// New analytics route for sellers
router.get('/analytics/:sellerId', getSellerAnalytics);

module.exports = router;
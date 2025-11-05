// routes/pet.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user');
const petController = require('../Controllers/pet');
const order = require('../Controllers/order');
const upload = require('../utils/multer');

// Admin User CRUD
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);



// ✅ Use multer fields middleware correctly
const petUploadFields = upload.fields([
  { name: 'level1_image', maxCount: 1 },
  { name: 'level2_image', maxCount: 1 },
  { name: 'level3_image', maxCount: 1 }
]);
// Admin Pet CRUD
router.get('/pets', petController.getAllPets);
router.get('/pets/:id', petController.getPetById);
router.post('/pets', petUploadFields, petController.createPet);
router.put('/pets/:id', petUploadFields, petController.updatePet);
router.delete('/pets/:id', petController.deletePet);

//admin orders
router.get('/orders/all', order.getAllOrders);
router.patch('/orders/update-status', order.updateOrderStatus);



// =======================
// SELLER MANAGEMENT
// =======================
router.get('/pending-sellers', userController.getPendingSellers);
router.post('/approve-seller/:id', userController.approveSeller);
router.post('/reject-seller/:id', userController.rejectSeller);

module.exports = router;
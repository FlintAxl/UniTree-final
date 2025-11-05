const express = require('express');
const router = express.Router();
const petController = require('../Controllers/pet');

// User-side pet creation (when registering/choosing a pet)
router.post('/pets/user', petController.createPetForUser);

router.get('/pets/user/:user_id', petController.getUserPet);
router.post('/pets/feed', petController.feedPet);


module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} = require('../controllers/petController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPets);
router.get('/:id', getPetById);

// Protected/Admin routes
router.post('/', protect, admin, createPet);
router.route('/:id')
  .put(protect, admin, updatePet)
  .delete(protect, admin, deletePet);

module.exports = router;

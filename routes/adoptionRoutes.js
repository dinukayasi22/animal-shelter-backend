const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { 
  approveAdoption, 
  rejectAdoptionRequest,
  getAllApplications,
  getUserAdoptionHistory,
  createAdoption
} = require('../controllers/adoptionController');

const router = express.Router();

// Route to get all adoption applications (admin only)
router.get('/', protect, admin, getAllApplications);

// Route to approve an adoption
router.patch('/:id/approve', protect, admin, approveAdoption);

// Route to reject an adoption request
router.patch('/:id/reject', protect, admin , rejectAdoptionRequest);

// Route to get adoption history for a user
router.get('/history', protect, getUserAdoptionHistory);

// Route to create a new adoption
router.post('/', protect, createAdoption);

module.exports = router;
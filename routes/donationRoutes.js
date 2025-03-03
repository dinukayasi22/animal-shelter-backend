const express = require('express');
const router = express.Router();
const {
  createGoods,
  getAll,
  getUserDonations
} = require('../controllers/donationController');
const { protect, admin } = require('../middleware/auth');


// Donation routes
router.post('/goods', createGoods);
router.get('/all', protect, admin, getAll);
router.get('/my-donations', protect, getUserDonations);

module.exports = router;
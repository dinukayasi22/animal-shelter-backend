const GoodsDonation = require('../models/GoodsDonation');

// Export the controller functions directly
module.exports = {
  // Test endpoint handler
  test: (req, res) => {
    res.json({ message: 'Donation routes are working' });
  },

  // Create a new goods donation
  createGoods: async (req, res) => {
    try {
      const {
        name,
        email,
        itemType,
        description,
        quantity,
        dropOffDate,
        contactNumber
      } = req.body;

      const donation = new GoodsDonation({
        name,
        email,
        itemType,
        description,
        quantity,
        dropOffDate,
        contactNumber,
        user: req.user ? req.user._id : null
      });

      await donation.save();

      res.status(201).json({
        success: true,
        message: 'Donation recorded successfully',
        donation
      });
    } catch (error) {
      console.error('Error creating donation:', error);
      res.status(500).json({
        success: false,
        message: 'Error recording donation',
        error: error.message
      });
    }
  },

  // Get all donations
  getAll: async (req, res) => {
    try {
      const donations = await GoodsDonation.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email');
      
      res.json({
        success: true,
        donations
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching donations',
        error: error.message
      });
    }
  },

  // Get user's donations
  getUserDonations: async (req, res) => {
    try {
      const donations = await GoodsDonation.find({ user: req.user._id })
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        donations
      });
    } catch (error) {
      console.error('Error fetching user donations:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching your donations',
        error: error.message
      });
    }
  }
};
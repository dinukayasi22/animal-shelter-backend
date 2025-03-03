const Animal = require('../models/Animal');
const User = require('../models/User');
const Adoption = require('../models/Adoption');


const adminController = {
  getDashboardStats: async (req, res) => {
    try {
      // Get counts
      const totalAnimals = await Animal.countDocuments();
      const availableAnimals = await Animal.countDocuments({ status: 'Available' });
      const adoptedAnimals = await Animal.countDocuments({ status: 'Adopted' });
      const pendingAdoptions = await Adoption.countDocuments({ status: 'Pending' });
      const totalUsers = await User.countDocuments();

      // Get recent adoptions
      const recentAdoptions = await Adoption.find()
        .populate('user', 'name')
        .populate('animal', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        totalAnimals,
        availableAnimals,
        adoptedAnimals,
        pendingAdoptions,
        totalUsers,
        recentAdoptions
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = adminController; 
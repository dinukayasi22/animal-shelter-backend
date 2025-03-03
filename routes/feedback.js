const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();
const {protect, admin} = require('../middleware/auth')

// POST feedback
router.post('/', async (req, res) => {
    const { name, email, contactNo, description } = req.body;
  
    try {
      const feedback = new Feedback({
        name,
        email,
        contactNo,
        description,
      });
  
      await feedback.save();
      res.status(201).json({ message: 'Feedback submitted successfully!' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// GET all feedback
router.get('/', async (req, res) => {
    try {
      const feedbacks = await Feedback.find();
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add delete route
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
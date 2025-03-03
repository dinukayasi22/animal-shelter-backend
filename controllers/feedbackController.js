const getFeedbacks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6; // Default to 6 feedbacks
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
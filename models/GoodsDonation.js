const mongoose = require('mongoose');

const goodsDonationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  itemType: {
    type: String,
    required: true,
    enum: ['blankets', 'towels', 'beds', 'food', 'other']
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  dropOffDate: {
    type: Date,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'received', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GoodsDonation', goodsDonationSchema); 
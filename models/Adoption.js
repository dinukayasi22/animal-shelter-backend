const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  applicationDetails: {
    housingType: {
      type: String,
      required: true,
      enum: ['House', 'Apartment', 'Other']
    },
    hasYard: Boolean,
    hasOtherPets: Boolean,
    otherPetsDetails: String,
    hasChildren: Boolean,
    childrenAges: String,
    workSchedule: String,
    previousPetExperience: String,
    reasonForAdopting: String
  },
  reviewNotes: {
    type: String
  },
  rejectionReason: {
    type: String
  },
  adoptionDate: {
    type: Date
  },
  homeVisitDate: {
    type: Date
  },
  homeVisitCompleted: {
    type: Boolean,
    default: false
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String
  },
  adoptionFee: {
    type: Number,
    default: 4000 // LKR 4000
  },
  animalStatus: {
    type: String,
    enum: ['Active', 'Deleted'],
    default: 'Active'
  },
  animalInfo: {
    name: String,
    breed: String,
    age: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Adoption = mongoose.model('Adoption', adoptionSchema);
module.exports = Adoption;
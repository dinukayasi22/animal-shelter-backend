const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  species: {
    type: String,
    required: [true, 'Species is required'],
    trim: true
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female']
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: ['Small', 'Medium', 'Large']
  },
  healthStatus: {
    type: String,
    required: [true, 'Health status is required'],
    trim: true
  },
  vaccinated: {
    type: Boolean,
    default: false
  },
  neutered: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  status: {
    type: String,
    enum: ['Available', 'Pending', 'Adopted', 'Archived'],
    default: 'Available'
  },
  medicalNotes: {
    type: String,
    default: '',
    trim: true
  },
  intakeDate: {
    type: Date,
    default: Date.now
  },
  adoptionHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adoption'
  }]
}, {
  timestamps: true,
  strict: true
});

// Add pre-remove middleware
animalSchema.pre('remove', async function(next) {
  try {
    // Archive instead of delete related adoptions
    await Adoption.updateMany(
      { animal: this._id },
      { 
        $set: { 
          status: 'Archived',
          animalStatus: 'Deleted',
          animalInfo: {
            name: this.name,
            breed: this.breed,
            age: this.age
          }
        } 
      }
    );
    
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Animal', animalSchema);
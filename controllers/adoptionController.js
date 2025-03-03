const Adoption = require('../models/Adoption');
const Animal = require('../models/Animal');

const adoptionController = {
  // Submit adoption application
  submitApplication: async (req, res) => {
    try {
      const { animalId, applicationDetails } = req.body;
      
      // Check if animal is available
      const animal = await Animal.findById(animalId);
      if (!animal || animal.status !== 'Available') {
        return res.status(400).json({ message: 'Animal is not available for adoption' });
      }

      const adoption = new Adoption({
        user: req.user._id,
        animal: animalId,
        applicationDetails,
      });

      const savedAdoption = await adoption.save();
      
      // Update animal status to pending
      animal.status = 'Pending';
      await animal.save();

      res.status(201).json(savedAdoption);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user's adoption applications
  getUserApplications: async (req, res) => {
    try {
      const adoptions = await Adoption.find({ user: req.user._id })
        .populate('animal')
        .sort('-createdAt');
      res.json(adoptions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all adoption applications (admin only)
  getAllApplications: async (req, res) => {
    try {
      const adoptions = await Adoption.find({})
        .populate('user', 'name email')
        .populate('animal')
        .sort('-createdAt');
      res.json(adoptions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update application status (admin only)
  updateApplicationStatus: async (req, res) => {
    try {
      const { status, reviewNotes, rejectionReason } = req.body;
      const adoption = await Adoption.findById(req.params.id);

      if (!adoption) {
        return res.status(404).json({ message: 'Application not found' });
      }

      adoption.status = status;
      adoption.reviewNotes = reviewNotes;
      if (status === 'Rejected') {
        adoption.rejectionReason = rejectionReason;
      }
      if (status === 'Approved') {
        adoption.adoptionDate = Date.now();
        // Update animal status
        await Animal.findByIdAndUpdate(adoption.animal, { status: 'Adopted' });
      }

      const updatedAdoption = await adoption.save();
      res.json(updatedAdoption);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Approve an adoption request
  approveAdoption: async (req, res) => {
    try {
      const adoptionId = req.params.id;

      // Find the adoption record
      const adoption = await Adoption.findById(adoptionId);
      if (!adoption) {
        return res.status(404).json({ message: 'Adoption not found' });
      }

      // Update the adoption status to 'Approved'
      adoption.status = 'Approved';
      adoption.adoptionDate = new Date();

      // Save the updated adoption record
      const updatedAdoption = await adoption.save();

      // Update the animal's status to 'Adopted'
      const animal = await Animal.findById(adoption.animal);
      if (animal) {
        animal.status = 'Adopted';
        await animal.save();
      }

      res.status(200).json(updatedAdoption);
    } catch (error) {
      console.error('Error approving adoption:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  // Reject an adoption request
  rejectAdoptionRequest: async (req, res) => {
    try {
      const adoptionId = req.params.id;
      const { rejectionReason } = req.body;

      // Find the adoption record
      const adoption = await Adoption.findById(adoptionId);
      if (!adoption) {
        return res.status(404).json({ message: 'Adoption not found' });
      }

      // Update the adoption status to 'Rejected'
      adoption.status = 'Rejected';
      adoption.rejectionReason = rejectionReason;

      // Update the status of the associated animal to 'Available'
      const animal = await Animal.findById(adoption.animal);
      if (animal) {
        animal.status = 'Available'; // Set animal status to 'Available'
        await animal.save(); // Save the updated animal record
      }

      // Save the updated adoption record
      const updatedAdoption = await adoption.save();

      res.status(200).json(updatedAdoption);
    } catch (error) {
      console.error('Error rejecting adoption:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  getUserAdoptionHistory: async (req, res) => {
    try {
      const userId = req.user._id; // Get user ID from authenticated user
      

      const adoptions = await Adoption.find({ user: userId })
        .populate('animal') // Populate animal details
        .sort('-createdAt'); // Sort by creation date

      res.json(adoptions);
    } catch (error) {
      console.error('Error fetching adoption history:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  createAdoption: async (req, res) => {
    try {
      const { animalId, applicationDetails } = req.body; // Ensure you're getting the right data
      const userId = req.user._id; // Get user ID from authenticated user

      const newAdoption = new Adoption({
        user: userId,
        animal: animalId,
        applicationDetails,
        status: 'Pending', // Set initial status
      });

      const savedAdoption = await newAdoption.save();
      res.status(201).json(savedAdoption); // Respond with the created adoption
    } catch (error) {
      console.error('Error creating adoption:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  adoptAnimal: async (req, res) => {
    const { animalId } = req.body; // Assuming you send animalId in the request body
    const userId = req.user._id; // Get the user ID from the authenticated user

    try {
      // Find the animal to adopt
      const animal = await Animal.findById(animalId);
      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }

      // Create a new adoption record with status set to 'Pending'
      const adoption = await Adoption.create({
        animal: animalId,
        user: userId,
        status: 'Pending', // Set initial status to 'Pending'
      });

      res.status(201).json(adoption);
    } catch (error) {
      console.error('Error adopting animal:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = adoptionController;
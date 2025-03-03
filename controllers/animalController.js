const Animal = require('../models/Animal');
const Adoption = require('../models/Adoption');

const animalController = {
  // Create new animal
  createAnimal: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Image is required' });
      }

      const animalData = {
        name: req.body.name,
        species: req.body.species,
        breed: req.body.breed,
        age: Number(req.body.age),
        gender: req.body.gender,
        size: req.body.size,
        healthStatus: req.body.healthStatus,
        vaccinated: req.body.vaccinated === 'true',
        neutered: req.body.neutered === 'true',
        description: req.body.description,
        status: req.body.status || 'Available',
        medicalNotes: req.body.medicalNotes || '',
        image: req.file.path
      };

      const animal = new Animal(animalData);
      const savedAnimal = await animal.save();
      
      res.status(201).json(savedAnimal);
    } catch (error) {
      console.error('Error creating animal:', error);
      res.status(500).json({ message: error.message });
    }
  },

  getAnimals: async (req, res) => {
    try {
      const animals = await Animal.find().sort({ createdAt: -1 });
      res.json(animals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAnimalById: async (req, res) => {
    try {
      const animal = await Animal.findById(req.params.id);
      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }
      res.json(animal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateAnimal: async (req, res) => {
    try {
      const updateData = { ...req.body };
      
      if (req.file) {
        updateData.image = req.file.path;
      }

      const animal = await Animal.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }

      res.json(animal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteAnimal: async (req, res) => {
    try {
      const animal = await Animal.findById(req.params.id);
      
      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }

      // Archive instead of delete
      animal.status = 'Archived';
      await animal.save();

      // Update related adoptions
      await Adoption.updateMany(
        { animal: animal._id },
        { 
          animalStatus: 'Deleted',
          animalInfo: {
            name: animal.name,
            breed: animal.breed,
            age: animal.age
          }
        }
      );

      res.json({ message: 'Animal archived and adoptions updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = animalController;
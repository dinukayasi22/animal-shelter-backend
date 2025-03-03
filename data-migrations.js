const mongoose = require('mongoose');
const Adoption = require('./models/Adoption');
const Animal = require('./models/Animal');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const migrateAdoptions = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB...');
    
    const adoptions = await Adoption.find().populate('animal');
    console.log(`Found ${adoptions.length} adoptions to migrate`);

    let migratedCount = 0;
    for (const adoption of adoptions) {
      if (adoption.animal) {
        adoption.animalInfo = {
          name: adoption.animal.name,
          breed: adoption.animal.breed,
          age: adoption.animal.age
        };
        await adoption.save();
        migratedCount++;
      }
    }

    console.log(`Successfully migrated ${migratedCount} adoption records`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:');
    console.error('Error message:', error.message);
    console.error('Make sure:');
    console.error('1. Your .env file exists in backend/ directory');
    console.error('2. It contains MONGO_URI=your_connection_string');
    console.error('3. You have write permissions to the database');
    process.exit(1);
  }
};

migrateAdoptions();
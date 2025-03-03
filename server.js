require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const adoptionRoutes = require('./routes/adoptionRoutes'); // Adjust the path as necessary
const donationRoutes = require('./routes/donationRoutes');
const feedbackRoutes = require('./routes/feedback');


const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true,
  exposedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/animals', require('./routes/animalRoutes'));
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/feedback', feedbackRoutes);

// Add this line to serve the uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
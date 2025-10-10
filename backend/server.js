const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
// const { createAdmin } = require('./controllers/authController'); // See note below

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');

// --- Initial Setup ---
dotenv.config();
connectDB();

// IMPORTANT NOTE: The createAdmin() function should not run every time the server starts.
// This can cause errors or unexpected behavior in production.
// It is best practice to run this as a separate, one-time script to set up your database.
// createAdmin();

const app = express();

// --- Middleware ---
app.use(express.json());

// Secure CORS policy
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL // e.g., 'https://your-app-name.vercel.app'
    : 'https://advence-exam-syatem.vercel.app/'
    // : 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// --- Static File Serving ---
// Define __dirname for ES Modules compatibility
const __dirname = path.resolve(); 
// Make the 'uploads' folder public so images can be served
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// =================================================================
// --- PRODUCTION DEPLOYMENT CONFIGURATION ---
// This section should be AFTER your API routes
if (process.env.NODE_ENV === 'production') {
  // 1. Set the frontend build folder as a static folder
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // 2. For any request that doesn't match the API routes, serve the frontend's index.html file
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  // Root route for development mode
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}
// =================================================================


const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
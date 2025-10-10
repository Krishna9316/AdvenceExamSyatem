const express = require('express'); 
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { createAdmin } = require('./controllers/authController'); // Changed from source [2]

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes'); 

// --- Initial Setup ---
dotenv.config();
connectDB();
createAdmin(); // Added this line to run the function

const app = express();

// --- Middleware ---
app.use(express.json());
// Secure CORS policy [cite: 4]
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ?
 process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/student', studentRoutes);

// --- Static File Serving ---
// Make the 'uploads' folder public so images can be served [cite: 7]
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// ================================================================= [cite: 8]
// --- PRODUCTION DEPLOYMENT CONFIGURATION ---
// This section should be AFTER your API routes [cite: 8]
if (process.env.NODE_ENV === 'production') {
  // 1. Set the frontend build folder as a static folder [cite: 8]
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  // 2. For any request that doesn't match the API routes, serve the frontend's index.html file [cite: 9]
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else { 
  // Root route for development mode [cite: 10]
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}
// ================================================================= [cite: 11]


const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
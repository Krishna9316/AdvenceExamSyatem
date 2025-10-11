const express = require('express'); 
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { createAdmin } = require('./controllers/authController');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes'); 

// --- Initial Setup ---
dotenv.config();
connectDB();
createAdmin(); 

const app = express();

// --- Middleware ---
app.use(express.json());
// Secure CORS policy
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL
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

// --- Root Route ---
app.get('/', (req, res) => {
    res.send('API is running...');
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
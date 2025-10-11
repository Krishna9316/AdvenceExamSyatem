[cite_start]const express = require('express'); [cite: 1]
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
[cite_start]const { createAdmin } = require('./controllers/authController'); [cite: 2]

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
[cite_start]const studentRoutes = require('./routes/studentRoutes'); [cite: 3]

// --- Initial Setup ---
dotenv.config();
connectDB();
[cite_start]createAdmin(); [cite: 4]

const app = express();

// --- Middleware ---
app.use(express.json());
[cite_start]// Secure CORS policy [cite: 5]
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ?
 [cite_start]process.env.FRONTEND_URL [cite: 6]
    : 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
[cite_start]app.use('/api/student', studentRoutes); [cite: 7]

// --- Static File Serving ---
[cite_start]// Make the 'uploads' folder public so images can be served [cite: 7]
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- Root Route ---
app.get('/', (req, res) => {
    res.send('API is running...');
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
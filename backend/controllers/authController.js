const User = require('../models/User');
const jwt =require('jsonwebtoken');

// Utility to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const loginUser = async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      surname: user.surname,
      studentName: user.studentName,
      fatherName: user.fatherName,
      profilePicture: user.profilePicture,
      userId: user.userId,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid User ID or Password' });
  }
};

// Admin can create a default admin account on first run (optional)
const createAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            await User.create({
                fullName: 'Admin User',
                // --- FIX: ADDED PLACEHOLDER DATA FOR REQUIRED FIELDS ---
                studentName: 'Admin',
                fatherName: 'N/A',
                surname: 'User',
                // --- END OF FIX ---
                userId: 'admin',
                password: 'adminpassword', // Use a stronger password in a real app
                role: 'admin',
            });
            console.log('Default admin created. UserID: admin, Password: adminpassword');
        }
    } catch (error) {
        console.error('Error creating default admin:', error.message);
    }
};

module.exports = { loginUser, createAdmin };
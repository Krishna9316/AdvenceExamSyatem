const Certificate = require('../models/Certificate');

// @desc    Register a new certificate
// @route   POST /api/admin/certificates
// @access  Private/Admin
const registerCertificate = async (req, res) => {
  const { 
    studentName, 
    fatherName, 
    surname, 
    dateOfBirth, 
    mobileNumber, 
    standard, 
    schoolName, 
    courseName 
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Student picture is required' });
  }

  try {
    const newCertificate = new Certificate({
      studentName,
      fatherName,
      surname,
      dateOfBirth,
      mobileNumber,
      standard,
      schoolName,
      courseName,
      studentPicture: `/uploads/${req.file.filename}`,
    });

    const savedCertificate = await newCertificate.save();
    res.status(201).json({ message: 'Certificate registered successfully!', certificate: savedCertificate });
  } catch (error) {
    res.status(400).json({ message: 'Invalid data provided', error: error.message });
  }
};

// @desc    Get all registered certificates
// @route   GET /api/admin/certificates
// @access  Private/Admin
const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({}).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { registerCertificate, getAllCertificates };
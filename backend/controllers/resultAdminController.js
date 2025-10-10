const Result = require('../models/Result');

// @desc    Get all results with student and quiz info
// @route   GET /api/admin/results
// @access  Private/Admin
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find({})
      .populate('student', 'fullName surname studentName fatherName profilePicture')
      .populate('quiz', 'title');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getAllResults };
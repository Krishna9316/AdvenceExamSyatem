// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { getAvailableQuizzes, getQuizForTest, submitQuiz,getMyResults } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// Note: isAdmin middleware is not needed here
router.route('/quizzes').get(protect, getAvailableQuizzes);
router.route('/quizzes/:id').get(protect, getQuizForTest);
router.route('/quizzes/:id/submit').post(protect, submitQuiz);
router.route('/results').get(protect, getMyResults);

module.exports = router;
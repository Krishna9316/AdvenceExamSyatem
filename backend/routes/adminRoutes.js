const express = require('express');
const router = express.Router();

// --- CONTROLLER IMPORTS ---
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createQuiz
} = require('../controllers/adminController');

const {
  registerCertificate, 
  getAllCertificates 
} = require('../controllers/certificateController');

const {
  getAllQuizzes,
  getQuizById,
  updateQuestion,
  deleteQuestion,
  deleteQuiz
} = require('../controllers/quizAdminController');

const {
  getAllResults
} = require('../controllers/resultAdminController');

// --- MIDDLEWARE IMPORTS ---
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


// --- STUDENT ROUTES ---
router.route('/students')
  .post(protect, isAdmin, upload.single('profilePicture'), createStudent)
  .get(protect, isAdmin, getAllStudents);

router.route('/students/:id')
  .get(protect, isAdmin, getStudentById)
  .put(protect, isAdmin, updateStudent)
  .delete(protect, isAdmin, deleteStudent);


// --- QUIZ & QUESTION ROUTES ---
router.route('/quizzes')
  .post(protect, isAdmin, createQuiz)        // Create a new quiz
  .get(protect, isAdmin, getAllQuizzes);      // Get all quizzes

router.route('/quizzes/:id')
  .get(protect, isAdmin, getQuizById)        // Get a single quiz
  .delete(protect, isAdmin, deleteQuiz);      // Delete a single quiz

router.route('/quizzes/:quizId/questions/:questionId')
  .delete(protect, isAdmin, deleteQuestion);  // Delete a question from a quiz

router.route('/questions/:id')
  .put(protect, isAdmin, updateQuestion);     // Update a question


// --- RESULT ROUTES ---
router.route('/results')
  .get(protect, isAdmin, getAllResults);

router.route('/certificates')
  .post(protect, isAdmin, upload.single('studentPicture'), registerCertificate)
  .get(protect, isAdmin, getAllCertificates);

module.exports = router;
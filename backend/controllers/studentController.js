const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Question = require('../models/Question');

// @desc    Get all available quizzes for students
// @route   GET /api/student/quizzes
// @access  Private/Student
const getAvailableQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}).select('title description duration');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a specific quiz by ID (without correct answers)
// @route   GET /api/student/quizzes/:id
// @access  Private/Student
const getQuizForTest = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    
    if (quiz) {
      // Create a version of the quiz that does not include the 'isCorrect' flag
      const quizForStudent = {
        ...quiz.toObject(),
        questions: quiz.questions.map(q => ({
          _id: q._id,
          questionText: q.questionText,
          options: q.options.map(opt => ({ _id: opt._id, text: opt.text })),
        })),
      };
      res.json(quizForStudent);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Submit a quiz and calculate the score
// @route   POST /api/student/quizzes/:id/submit
// @access  Private/Student
const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const quizId = req.params.id;
  const studentId = req.user._id;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    quiz.questions.forEach(question => {
      const studentAnswer = answers[question._id];
      const correctAnswer = question.options.find(opt => opt.isCorrect)?._id;
      if (studentAnswer && correctAnswer && studentAnswer.toString() === correctAnswer.toString()) {
        score++;
      }
    });

    const total = quiz.questions.length;

    // Create a new result or update an existing one for the same quiz
    await Result.findOneAndUpdate(
      { student: studentId, quiz: quizId },
      { score, total },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    // Return the score, total, and quiz title for the result page
    res.json({ score, total, quizTitle: quiz.title });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all past results for the logged-in student
// @route   GET /api/student/results
// @access  Private
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('quiz', 'title')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  getAvailableQuizzes, 
  getQuizForTest,
  submitQuiz,
  getMyResults 
};
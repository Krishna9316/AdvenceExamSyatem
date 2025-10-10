const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');

// @desc    Get all quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}).select('title description');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single quiz with all its questions
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a question
const updateQuestion = async (req, res) => {
  const { questionText, options } = req.body;
  try {
    const question = await Question.findById(req.params.id);
    if (question) {
      question.questionText = questionText;
      question.options = options;
      await question.save();
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a question from a quiz
const deleteQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  try {
    await Quiz.updateOne({ _id: quizId }, { $pull: { questions: questionId } });
    await Question.findByIdAndDelete(questionId);
    res.json({ message: 'Question removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a quiz, its questions, and its results
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
      if (quiz.questions && quiz.questions.length > 0) {
        await Question.deleteMany({ _id: { $in: quiz.questions } });
      }
      await Result.deleteMany({ quiz: req.params.id });
      await Quiz.findByIdAndDelete(req.params.id);
      res.json({ message: 'Quiz, questions, and results have been removed' });
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  getAllQuizzes, 
  getQuizById, 
  updateQuestion, 
  deleteQuestion,
  deleteQuiz
};
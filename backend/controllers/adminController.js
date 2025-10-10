const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// CREATE STUDENT
const createStudent = async (req, res) => {
  const { surname, studentName, fatherName, userId, password } = req.body;
  const fullName = `${studentName} ${surname}`;

  const userExists = await User.findOne({ userId });

  if (userExists) {
    return res.status(400).json({ message: 'User ID already exists' });
  }

  try {
    const user = await User.create({
      surname,
      studentName,
      fatherName,
      fullName,
      userId,
      password,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
    res.status(201).json({ message: 'Student created successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid user data', error: error.message });
  }
};

// GET ALL STUDENTS
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET STUDENT BY ID (for Edit page)
const getStudentById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// UPDATE STUDENT (for Edit page)
const updateStudent = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.surname = req.body.surname || user.surname;
    user.studentName = req.body.studentName || user.studentName;
    user.fatherName = req.body.fatherName || user.fatherName;
    user.fullName = `${user.studentName} ${user.surname}`;
    user.userId = req.body.userId || user.userId;
    
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// DELETE STUDENT
const deleteStudent = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// ✅ CREATE QUIZ (This function is now complete)
const createQuiz = async (req, res) => {
  const { title, description, duration, questions } = req.body;

  try {
    // 1. Create all the question documents in the database
    const questionDocs = await Question.insertMany(questions);
    
    // 2. Get the IDs of the newly created questions
    const questionIds = questionDocs.map(q => q._id);

    // 3. Create the quiz document with the references to the questions
    const quiz = new Quiz({
      title,
      description,
      duration,
      questions: questionIds,
    });

    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz', error: error.message });
  }
};

module.exports = { 
  createStudent, 
  getAllStudents, 
  getStudentById,
  updateStudent,
  deleteStudent,
  createQuiz
};
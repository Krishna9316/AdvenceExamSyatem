import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(10);
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
  ]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...questions];
    if (field === 'option') {
      const { oIndex, val } = value;
      newQuestions[qIndex].options[oIndex] = val;
    } else {
      newQuestions[qIndex][field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
    ]);
  };
  
  const removeQuestion = (qIndex) => {
    if (questions.length <= 1) return;
    const newQuestions = questions.filter((_, index) => index !== qIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formattedQuestions = questions.map(q => ({
      questionText: q.questionText,
      options: q.options.map((opt, oIndex) => ({
        text: opt,
        isCorrect: q.correctAnswerIndex == oIndex,
      })),
    }));

    const quizData = {
      title,
      description,
      duration: Number(duration), // ✅ FIX: Ensure duration is a number
      questions: formattedQuestions,
    };
    
    try {
      const config = { 
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        } 
      };
      await axios.post('http://localhost:5001/api/admin/quizzes', quizData, config);
      setSuccess('Quiz created successfully! Redirecting...');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz.');
    }
  };

  // ... keep the rest of your return (...) JSX exactly the same
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">Create New Quiz</h1>
      {error && <p className="text-red-500 bg-red-900/20 p-3 rounded-md mb-4">{error}</p>}
      {success && <p className="text-green-500 bg-green-900/20 p-3 rounded-md mb-4">{success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Details */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Quiz Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <div>
              <input type="number" placeholder="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} required min="1" className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="p-4 border border-gray-700 rounded-lg relative space-y-4">
               <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-300">Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 hover:text-red-400">
                    <FiTrash2 size={20} />
                  </button>
                )}
               </div>

              <textarea placeholder="Enter question text..." value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} required className="w-full bg-gray-700 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIndex) => (
                     <input key={oIndex} type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleQuestionChange(qIndex, 'option', { oIndex, val: e.target.value })} required className="w-full bg-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                  ))}
                </div>
                
                <div className="md:col-span-1">
                   <label className="block mb-2 text-sm font-medium text-gray-300">Correct Answer</label>
                   <select value={q.correctAnswerIndex} onChange={(e) => handleQuestionChange(qIndex, 'correctAnswerIndex', e.target.value)} className="w-full bg-gray-700 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="0">Option 1</option>
                      <option value="1">Option 2</option>
                      <option value="2">Option 3</option>
                      <option value="3">Option 4</option>
                   </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button type="button" onClick={addQuestion} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-300">
            <FiPlus /> Add Question
          </button>
          <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition duration-300">
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const QuizInstructions = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`http://localhost:5001/api/student/quizzes/${id}`, config);
        setQuiz(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch quiz details", error);
        setIsLoading(false);
      }
    };
    if (user?.token) {
      fetchQuiz();
    }
  }, [id, user?.token]);

  // SVG Icons
  const Icons = {
    Clock: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    FileText: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    Award: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    CheckCircle: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    AlertCircle: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Play: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    User: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    BookOpen: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <div className="text-2xl text-gray-300">Loading Instructions...</div>
        </div>
      </div>
    );
  }
  
  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Icons.AlertCircle />
          <div className="text-2xl text-gray-300 mt-4">Quiz details not found.</div>
          <Link 
            to="/dashboard" 
            className="mt-4 inline-block text-indigo-400 hover:text-indigo-300"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const totalMarks = quiz.questions.length;
  const passingMarks = Math.ceil(totalMarks * 0.4);
  const passingPercentage = Math.round((passingMarks / totalMarks) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6 shadow-2xl">
            <Icons.BookOpen />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Quiz Instructions
          </h1>
          <p className="text-gray-400 text-lg">Get ready to test your knowledge!</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-8 border-b border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-500/20 rounded-full border border-indigo-400/30">
                <Icons.User />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Welcome,</p>
                <p className="text-xl font-semibold text-white">{user?.fullName}</p>
              </div>
            </div>
          </div>

          {/* Quiz Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Quiz Info Card */}
              <div className="bg-gray-700/50 rounded-2xl p-6 border border-gray-600/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Icons.FileText />
                  <span className="ml-2">Exam Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                    <span className="text-gray-400">Exam Name:</span>
                    <span className="text-white font-medium">{quiz.title}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                    <span className="text-gray-400">Total Questions:</span>
                    <span className="text-white font-medium">{quiz.questions.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Total Marks:</span>
                    <span className="text-white font-medium">{totalMarks}</span>
                  </div>
                </div>
              </div>

              {/* Requirements Card */}
              <div className="bg-gray-700/50 rounded-2xl p-6 border border-gray-600/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Icons.Award />
                  <span className="ml-2">Passing Requirements</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                    <span className="text-gray-400">Minimum Marks:</span>
                    <span className="text-white font-medium">{passingMarks}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                    <span className="text-gray-400">Passing Percentage:</span>
                    <span className="text-green-400 font-medium">{passingPercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Time Limit:</span>
                    <span className="text-white font-medium flex items-center">
                      <Icons.Clock />
                      <span className="ml-1">{quiz.duration} Minutes</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Icons.AlertCircle />
                <span className="ml-2">Important Instructions</span>
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <Icons.CheckCircle />
                  <span className="ml-3">Make sure you have a stable internet connection</span>
                </li>
                <li className="flex items-start">
                  <Icons.CheckCircle />
                  <span className="ml-3">Do not refresh the page during the quiz</span>
                </li>
                <li className="flex items-start">
                  <Icons.CheckCircle />
                  <span className="ml-3">Timer will start as soon as you begin the quiz</span>
                </li>
                <li className="flex items-start">
                  <Icons.CheckCircle />
                  <span className="ml-3">You cannot pause once the quiz has started</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <Link 
                to={`/quiz/take/${id}`}
                className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl min-w-[200px]"
              >
                <Icons.Play />
                <span>Start Quiz Now</span>
              </Link>
              <p className="text-gray-400 text-sm mt-4">
                Click the button above to begin your {quiz.duration}-minute quiz
              </p>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/30">
            <div className="text-2xl font-bold text-indigo-400">{quiz.questions.length}</div>
            <div className="text-gray-400 text-sm">Total Questions</div>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/30">
            <div className="text-2xl font-bold text-orange-400">{quiz.duration}</div>
            <div className="text-gray-400 text-sm">Minutes Duration</div>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/30">
            <div className="text-2xl font-bold text-green-400">{passingPercentage}%</div>
            <div className="text-gray-400 text-sm">To Pass</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInstructions;
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Timer from '../../components/Timer';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [quiz, setQuiz] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Function to shuffle options within each question
  const shuffleQuestionsAndOptions = (questions) => {
    return questions.map(question => ({
      ...question,
      options: shuffleArray(question.options)
    }));
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`http://localhost:5001/api/student/quizzes/${id}`, config);
        
        // Shuffle questions and options
        const shuffledQuestionsArray = shuffleQuestionsAndOptions(data.questions);
        const finalShuffled = shuffleArray(shuffledQuestionsArray);
        
        setQuiz(data);
        setShuffledQuestions(finalShuffled);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch quiz", error);
        setIsLoading(false);
      }
    };
    if(user?.token){
      fetchQuiz();
    }
  }, [id, user?.token]);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
    setShowMobileSidebar(false);
  };

  const handleSubmitConfirm = async () => {
    setIsSubmitting(true);
    setShowSubmitModal(false);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // The backend returns score, total, AND quizTitle
      const { data } = await axios.post(`http://localhost:5001/api/student/quizzes/${id}/submit`, { 
        answers,
        questionOrder: shuffledQuestions.map(q => q._id)
      }, config);
      
      // ✅ FIX: Pass the 'quizTitle' from the backend response
      navigate('/result', { state: { score: data.score, total: data.total, quizTitle: data.quizTitle } });

    } catch (error) {
      console.error("Failed to submit quiz", error);
      setIsSubmitting(false);
    }
  };

  // SVG Icons
  const Icons = {
    ArrowLeft: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    ),
    ArrowRight: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
    Check: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    Clock: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Grid: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    Alert: () => (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    Close: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  };

  // Beautiful Submit Confirmation Modal
  const SubmitConfirmationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700/50 shadow-2xl max-w-md w-full mx-auto transform animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Icons.Alert className="text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Submit Quiz?</h3>
              <p className="text-gray-400 text-sm mt-1">Final Confirmation</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-300 text-lg mb-4">
              Are you sure you want to submit the quiz?
            </p>
            <p className="text-gray-400 text-sm">
              You won't be able to change your answers after submission.
            </p>
          </div>

          {/* Quiz Summary */}
          <div className="bg-gray-700/30 rounded-xl p-4 mb-6 border border-gray-600/30">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{Object.keys(answers).length}</div>
                <div className="text-gray-400">Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{shuffledQuestions.length - Object.keys(answers).length}</div>
                <div className="text-gray-400">Remaining</div>
              </div>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(Object.keys(answers).length / shuffledQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-700/50 flex gap-3">
          <button
            onClick={() => setShowSubmitModal(false)}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all hover:scale-105 border border-gray-600/50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitConfirm}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Icons.Check />
                Submit Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <div className="text-2xl text-gray-300">Loading Quiz...</div>
          <p className="text-gray-500 mt-2">Preparing your quiz session</p>
        </div>
      </div>
    );
  }
  
  if (!quiz || shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-300 mb-4">Quiz not found</div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / shuffledQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && <SubmitConfirmationModal />}

      {/* Fixed Timer Position */}
      <div className="fixed top-4 right-4 z-40">
        <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-sm border border-orange-400/50 rounded-xl px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-2 text-white font-bold">
            <Icons.Clock />
            <Timer initialMinutes={quiz.duration} onTimeUp={handleSubmitConfirm} />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="bg-indigo-600 hover:bg-indigo-700 backdrop-blur-sm border border-indigo-400/50 rounded-xl p-3 shadow-2xl text-white transition-all"
        >
          <Icons.Grid />
        </button>
      </div>

      <div className="relative max-w-6xl mx-auto pt-16">
        {/* Header Section */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {quiz.title}
              </h1>
              <p className="text-gray-400 mt-1">Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Progress Bar */}
              <div className="hidden md:block flex-1 max-w-xs">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{answeredQuestions}/{shuffledQuestions.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Questions Navigation Sidebar - Hidden on mobile, shown on desktop */}
          <div className={`lg:col-span-1 ${showMobileSidebar ? 'fixed inset-0 z-30 bg-gray-900/95 backdrop-blur-sm p-4' : 'hidden lg:block'}`}>
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl h-full lg:sticky lg:top-24">
              {/* Close button for mobile */}
              {showMobileSidebar && (
                <div className="flex justify-between items-center mb-4 lg:hidden">
                  <h3 className="text-lg font-semibold text-white">Questions</h3>
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {!showMobileSidebar && (
                <h3 className="text-lg font-semibold text-white mb-4">Questions</h3>
              )}

              <div className="grid grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {shuffledQuestions.map((question, index) => (
                  <button
                    key={question._id}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all ${
                      currentQuestionIndex === index
                        ? 'bg-indigo-500 text-white shadow-lg scale-105'
                        : answers[question._id]
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center text-sm text-blue-400">
                  <Icons.Check />
                  <span className="ml-2">{answeredQuestions} questions answered</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <Icons.Clock />
                  <span className="ml-2">{shuffledQuestions.length - answeredQuestions} remaining</span>
                </div>
              </div>

              {/* Quick Submit Button for Mobile */}
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 lg:hidden"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Icons.Check />
                    Submit Quiz
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 shadow-2xl">
              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentQuestionIndex + 1}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-300">Question</h2>
                </div>
                <p className="text-xl md:text-2xl text-white leading-relaxed">{currentQuestion.questionText}</p>
              </div>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion._id] === option._id;
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  
                  return (
                    <label
                      key={option._id}
                      className={`block p-4 md:p-6 rounded-xl border-2 transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-indigo-500/20 border-indigo-400 shadow-lg scale-[1.02]'
                          : 'bg-gray-700/50 border-gray-600 hover:border-indigo-500/50 hover:bg-gray-700/70'
                      }`}
                    >
                      <input
                        type="radio"
                        name={currentQuestion._id}
                        value={option._id}
                        onChange={() => handleOptionSelect(currentQuestion._id, option._id)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-600 text-gray-300 group-hover:bg-gray-500'
                        }`}>
                          {optionLetters[index]}
                        </div>
                        <span className="text-lg text-white flex-1">{option.text}</span>
                        {isSelected && (
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Icons.Check />
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-700/50">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <Icons.ArrowLeft />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="text-gray-400 text-sm hidden sm:block">
                  Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
                </div>

                {currentQuestionIndex < shuffledQuestions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 md:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold text-white transition-all hover:scale-105"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <Icons.ArrowRight />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    disabled={isSubmitting}
                    className="hidden lg:flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="hidden sm:inline">Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Icons.Check />
                        <span className="hidden sm:inline">Submit Quiz</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Mobile Submit Button */}
              {currentQuestionIndex === shuffledQuestions.length - 1 && (
                <div className="lg:hidden mt-6">
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Icons.Check />
                        Submit Quiz
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
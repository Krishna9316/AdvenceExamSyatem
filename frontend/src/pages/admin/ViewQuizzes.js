import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FiChevronDown, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import ConfirmationModal from '../../components/ConfirmationModal';

const ViewQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizData, setSelectedQuizData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  // ✅ 1. This function now fetches the list of all quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5001/api/admin/quizzes', config);
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchQuizzes();
  }, [user]);

  // ✅ 2. This function now fetches a quiz's full details when clicked
  const handleToggle = async (index, quizId) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close the accordion if it's already open
    } else {
      setActiveIndex(index); // Open the new accordion
      setSelectedQuizData(null); // Show loading state for questions
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`http://localhost:5001/api/admin/quizzes/${quizId}`, config);
        setSelectedQuizData(data);
      } catch (error) {
        console.error("Failed to fetch quiz details", error);
      }
    }
  };

  const openDeleteModal = (quizId, event) => {
    event.stopPropagation();
    setQuizToDelete(quizId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5001/api/admin/quizzes/${quizToDelete}`, config);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizToDelete));
      setActiveIndex(null); // Close accordion if it was open
    } catch (error) {
      console.error('Failed to delete quiz', error);
    } finally {
      setIsModalOpen(false);
      setQuizToDelete(null);
    }
  };

  if (isLoading) return <p className="text-center text-gray-400">Loading quizzes...</p>;
  if (quizzes.length === 0) return <p className="text-center text-gray-400">No quizzes have been created yet.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">All Created Quizzes</h1>
      <div className="space-y-4">
        {quizzes.map((quiz, index) => (
          <div key={quiz._id} className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="w-full flex justify-between items-center p-4 text-left">
              <button onClick={() => handleToggle(index, quiz._id)} className="flex-grow flex items-center justify-between">
                <span className="text-xl font-semibold text-white">{quiz.title}</span>
                <FiChevronDown
                  className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}
                  size={24}
                />
              </button>
              <button 
                onClick={(e) => openDeleteModal(quiz._id, e)} 
                className="ml-4 text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10"
                title="Delete Quiz"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
            
            {/* ✅ 3. This section now renders the questions and answers */}
            {activeIndex === index && (
              <div className="p-4 border-t border-gray-700">
                {selectedQuizData ? (
                  <div className="space-y-6">
                    {selectedQuizData.questions.map((q, qIndex) => (
                      <div key={q._id} className="bg-gray-900/50 p-4 rounded-md">
                        <p className="font-semibold text-lg text-gray-200 mb-3">{qIndex + 1}. {q.questionText}</p>
                        <ul className="space-y-2">
                          {q.options.map((opt) => (
                            <li
                              key={opt._id}
                              className={`flex items-center p-2 rounded-md ${
                                opt.isCorrect ? 'text-green-400 font-bold' : 'text-gray-300'
                              }`}
                            >
                              {opt.isCorrect && <FiCheckCircle className="mr-2 text-green-500" />}
                              {opt.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Loading questions...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Quiz"
        message="Are you sure you want to permanently delete this entire quiz and all of its questions? This action cannot be undone."
      />
    </div>
  );
};

export default ViewQuizzes;
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FiFileText, FiAward, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [quizRes, resultRes] = await Promise.all([
          axios.get('http://localhost:5001/api/student/quizzes', config),
          axios.get('http://localhost:5001/api/student/results', config)
        ]);
        setQuizzes(quizRes.data);
        setResults(resultRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.token) {
      fetchData();
    }
  }, [user]);

  const renderContent = () => {
    if (activeTab === 'exams') {
      if (isLoading) return <div className="text-center text-gray-400">Loading exams...</div>;
      if (quizzes.length === 0) return <div className="text-center text-gray-400">No exams are available at the moment.</div>;
      
      // ✅ 1. Create a Set of completed quiz IDs for easy and fast lookup.
      const completedQuizIds = new Set(results.map(result => result.quiz?._id));

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            // ✅ 2. Check if the student has already taken this quiz.
            const hasTaken = completedQuizIds.has(quiz._id);

            return (
              <div key={quiz._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col justify-between hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-white">{quiz.title}</h2>
                  <p className="text-gray-400 mb-4 flex items-center"><FiClock className="mr-2" /> {quiz.duration} Minutes</p>
                </div>

                {/* ✅ 3. Conditionally render the button based on completion status. */}
                {hasTaken ? (
                  <button 
                    disabled 
                    className="w-full text-center bg-green-500/20 text-green-400 font-bold py-2 px-4 rounded mt-4 flex items-center justify-center cursor-not-allowed"
                  >
                    <FiCheckCircle className="mr-2" />
                    Completed
                  </button>
                ) : (
                  <Link to={`/quiz/instructions/${quiz._id}`} className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Start Test
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    if (activeTab === 'results') {
        // ... (this section remains the same)
        if (isLoading) return <div className="text-center text-gray-400">Loading results...</div>;
        if (results.length === 0) return <div className="text-center text-gray-400">You have not completed any exams yet.</div>;
        return (
            <div className="space-y-4">
            {results.filter(result => result.quiz).map((result) => {
                const percentage = (result.score / result.total) * 100;
                const isPass = percentage >= 40;
                return (
                <div key={result._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                    <div>
                    <h3 className="text-xl font-semibold text-white">{result.quiz.title}</h3>
                    <p className="text-sm text-gray-400">Completed on: {new Date(result.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <p className="text-lg font-bold text-indigo-400">Score: {result.score} / {result.total}</p>
                        {isPass ? (
                            <span className="flex items-center text-green-400 font-semibold"><FiCheckCircle className="mr-2"/> Pass</span>
                        ) : (
                            <span className="flex items-center text-red-400 font-semibold"><FiXCircle className="mr-2"/> Fail</span>
                        )}
                    </div>
                </div>
                );
            })}
            </div>
        );
    }
  };

  return (
    <div className="flex h-full" >
      <aside className="w-64 bg-gray-800 p-4 rounded-lg mr-6 border border-gray-700 flex-shrink-0">
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('exams')} className={`w-full flex items-center px-4 py-3 rounded-md text-left text-lg transition-colors ${activeTab === 'exams' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <FiFileText className="mr-3" /> All Exams
          </button>
          <button onClick={() => setActiveTab('results')} className={`w-full flex items-center px-4 py-3 rounded-md text-left text-lg transition-colors ${activeTab === 'results' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <FiAward className="mr-3" /> My Results
          </button>
        </nav>
      </aside>
      <main className="flex-1">
        <h1 className="text-4xl font-bold mb-6 text-indigo-400">{activeTab === 'exams' ? 'Available Exams' : 'My Results'}</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;
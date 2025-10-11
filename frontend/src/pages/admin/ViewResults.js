import React, { useState, useEffect, useContext } from 'react';
import API from '../../api/axios'; // Use the central API
import { AuthContext } from '../../context/AuthContext';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const ViewResults = () => {
  const [results, setResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await API.get('/api/admin/results', config);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchResults();
  }, [user]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % results.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + results.length) % results.length);
  };

  if (isLoading) return <p>Loading results...</p>;
  if (results.length === 0) return <p>No results found.</p>;

  const currentResult = results[currentIndex];
  const student = currentResult.student;
  const quiz = currentResult.quiz;
  const percentage = (currentResult.score / currentResult.total) * 100;
  const isPass = percentage >= 50; 

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">Student Results</h1>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-2xl mx-auto flex flex-col items-center">
        <img
          // --- THIS IS THE FIX ---
          // Construct the full image URL using the backend's address
          src={`${process.env.REACT_APP_API_URL}${student.profilePicture.replace(/\\/g, '/')}`}
          alt="Profile"
          className="h-32 w-32 rounded-full object-cover border-4 border-indigo-500 mb-4"
        />
        <h2 className="text-3xl font-bold text-white">{student.fullName}</h2>
        <p className="text-lg text-gray-400 mb-6">Result for: {quiz.title}</p>

        <div className="w-full grid grid-cols-3 gap-4 text-center my-4">
          <div>
            <p className="text-2xl font-bold text-white">{currentResult.score}</p>
            <p className="text-sm text-gray-400">Correct Answers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{currentResult.total}</p>
            <p className="text-sm text-gray-400">Total Questions</p>
          </div>
          <div>
             <p className={`text-2xl font-bold ${isPass ? 'text-green-500' : 'text-red-500'}`}>
                {percentage.toFixed(0)}%
            </p>
             <p className="text-sm text-gray-400">Score</p>
          </div>
        </div>
        
        <div className={`mt-4 px-6 py-2 rounded-full text-lg font-semibold ${isPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isPass ? 'PASS' : 'FAIL'}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between max-w-2xl mx-auto mt-6">
        <button onClick={handlePrev} className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
            <FiArrowLeft className="mr-2"/> Previous
        </button>
        <div className="text-gray-400 self-center">
          Showing Result {currentIndex + 1} of {results.length}
        </div>
        <button onClick={handleNext} className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
            Next <FiArrowRight className="ml-2"/>
        </button>
      </div>
    </div>
  );
};

export default ViewResults;
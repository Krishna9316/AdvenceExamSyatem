import React, { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { AuthContext } from '../../context/AuthContext';

const ResultPage = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { score, total, quizTitle } = location.state || {}; // Get data from QuizPage

  if (score === undefined || total === undefined) {
    return (
      <div className="text-center">
        <h1 className="text-2xl text-white">Result data not available.</h1>
        <Link to="/" className="text-indigo-400">Go to Dashboard</Link>
      </div>
    );
  }
  
  const percentage = Math.round((score / total) * 100);
  const passingPercentage = 40;
  const isPass = percentage >= passingPercentage;

  const getGrade = () => {
    if (!isPass) return 'Fail';
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Very Good';
    if (percentage >= 60) return 'Good';
    return 'Average';
  };

  const grade = getGrade();
  const gradeColor = isPass ? 'text-green-400' : 'text-red-400';

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {isPass && <Confetti recycle={false} numberOfPieces={300} />}
      
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 max-w-2xl w-full text-center">
        {isPass && (
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Congratulations!</h1>
        )}
        <h2 className="text-2xl text-gray-300 mb-4">{user?.fullName}</h2>
        <p className="text-lg text-gray-400">You have completed the <span className="font-bold text-indigo-400">{quizTitle || 'exam'}</span>.</p>
        
        <div className={`my-8 p-6 rounded-lg ${isPass ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
          <p className="text-xl text-gray-200">Your Score</p>
          <p className="text-6xl font-bold text-white my-2">{score} <span className="text-3xl text-gray-400">/ {total}</span></p>
          <p className={`text-3xl font-semibold ${gradeColor}`}>{percentage}%</p>
        </div>
        
        <p className="text-xl text-gray-300">
          You have {isPass ? 'passed the exam with an' : 'failed the exam.'}
          {isPass && <span className={`font-bold ml-2 ${gradeColor}`}>{grade}</span>}
          {isPass && ' grade.'}
        </p>

        <Link to="/" className="mt-8 inline-block py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ResultPage;
import React from 'react';
import { Link } from 'react-router-dom';
import { FiUserPlus, FiUsers, FiFilePlus, FiEye, FiBarChart2, FiAward } from 'react-icons/fi';

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Add Student */}
        <Link to="/admin/create-student" className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
          <FiUserPlus className="text-5xl text-indigo-400 mb-3" />
          <h2 className="text-xl font-semibold text-white">Add New Student</h2>
          <p className="text-gray-400 text-center mt-1">Create a new student profile.</p>
        </Link>
        
        {/* Card 2: Manage Students */}
        <Link to="/admin/manage-students" className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
          <FiUsers className="text-5xl text-green-400 mb-3" />
          <h2 className="text-xl font-semibold text-white">Manage Students</h2>
          <p className="text-gray-400 text-center mt-1">View or delete students.</p>
        </Link>

        {/* Card 3: Create Quiz */}
        <Link to="/admin/create-quiz" className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
          <FiFilePlus className="text-5xl text-yellow-400 mb-3" />
          <h2 className="text-xl font-semibold text-white">Create New Quiz</h2>
          <p className="text-gray-400 text-center mt-1">Design and publish a new exam.</p>
        </Link>
        
        {/* Card 4: View Quizzes */}
        <Link to="/admin/view-quizzes" className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
          <FiEye className="text-5xl text-cyan-400 mb-3" />
          <h2 className="text-xl font-semibold text-white">View Quizzes</h2>
          <p className="text-gray-400 text-center mt-1">Review  existing quizzes.</p>
        </Link>
        
        {/* Card 5: View Results */}
        <Link to="/admin/view-results" className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
          <FiBarChart2 className="text-5xl text-pink-400 mb-3" />
          <h2 className="text-xl font-semibold text-white">View Results</h2>
          <p className="text-gray-400 text-center mt-1">Check student performance.</p>
        </Link>

        {/* Card for Certificate Registration */}
        <Link to="/admin/register-certificate" className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
          <FiAward className="text-5xl text-blue-400 mb-3" />
          <h2 className="text-xl font-semibold text-white">Register Certificate</h2>
          <p className="text-gray-400 text-center mt-1">Register a new user certificate.</p>
        </Link>

        {/* Card for Viewing Certificates */}
        <Link to="/admin/view-certificates" className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
          <FiEye className="text-5xl text-teal-400 mb-3" />
          <h2 className="text-xl font-semibold text-white">View Certificates</h2>
          <p className="text-gray-400 text-center mt-1">Browse all registered certificates.</p>
        </Link>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
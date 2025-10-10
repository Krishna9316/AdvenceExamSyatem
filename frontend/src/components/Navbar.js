import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png'; // ✅ 1. Import your logo file

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* ✅ 2. Update the Link to include the logo */}
          <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/') : '/login'} className="flex items-center text-xl font-bold text-white hover:text-indigo-400 transition-colors">
            <img src={logo} alt="ExamPortal Logo" className="h-20 w-auto mr-3" /> {/* Logo Image */}
            <span>Advance Exam Portal</span> {/* Title Text */}
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="text-right">
                  <p className="font-semibold text-xl text-white">{user.surname} {user.studentName} {user.fatherName} </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
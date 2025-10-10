import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [isStudentLogin, setIsStudentLogin] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { userId, password });
      
      const userRole = res.data.role;

      if (isStudentLogin && userRole !== 'student') {
        setError('Access Denied. Not a student account.');
        return;
      }
      if (!isStudentLogin && userRole !== 'admin') {
         setError('Access Denied. Not an admin account.');
         return;
      }
      
      login(res.data);
      
      if (userRole === 'student') {
        navigate('/welcome');
      } else {
        navigate('/admin/dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="flex border-b border-gray-600">
          <button onClick={() => setIsStudentLogin(true)} className={`w-1/2 py-4 text-center font-medium ${isStudentLogin ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}>
            Student
          </button>
          <button onClick={() => setIsStudentLogin(false)} className={`w-1/2 py-4 text-center font-medium ${!isStudentLogin ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}>
            Teacher / Admin
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input value={userId} onChange={(e) => setUserId(e.target.value)} id="user-id" name="userid" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="User ID" />
            </div>
            <div>
              <input value={password} onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password" />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
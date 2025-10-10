import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    surname: '',
    studentName: '',
    fatherName: '',
    userId: '',
    password: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Use FormData to handle file uploads
    const studentData = new FormData();
    studentData.append('surname', formData.surname);
    studentData.append('studentName', formData.studentName);
    studentData.append('fatherName', formData.fatherName);
    studentData.append('userId', formData.userId);
    studentData.append('password', formData.password);
    if (profilePicture) {
      studentData.append('profilePicture', profilePicture);
    }

    try {
      const config = {
        headers: {
          // Set Content-Type for file uploads
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post('http://localhost:5001/api/admin/students', studentData, config);
      setSuccess('Student created successfully! Redirecting...');
      setTimeout(() => navigate('/admin/manage-students'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create student.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">Create New Student</h1>
      {error && <p className="text-red-500 bg-red-900/20 p-3 rounded-md mb-4">{error}</p>}
      {success && <p className="text-green-500 bg-green-900/20 p-3 rounded-md mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="studentName" placeholder="Student Name" onChange={handleChange} required className="bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="text" name="surname" placeholder="Surname" onChange={handleChange} required className="bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <input type="text" name="fatherName" placeholder="Father's Name" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        
        {/* Re-add the profile picture input field */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">Profile Picture</label>
          <input type="file" name="profilePicture" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"/>
        </div>

        <hr className="border-gray-600"/>
        <input type="text" name="userId" placeholder="Student User ID" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">
          Create Student
        </button>
      </form>
    </div>
  );
};

export default CreateStudent;
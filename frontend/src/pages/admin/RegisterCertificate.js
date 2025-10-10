import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const RegisterCertificate = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    surname: '',
    dateOfBirth: '',
    mobileNumber: '',
    standard: '',
    schoolName: '',
    courseName: '',
  });
  const [studentPicture, setStudentPicture] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setStudentPicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!studentPicture) {
      setError('Student picture is required.');
      return;
    }

    const certificateData = new FormData();
    Object.keys(formData).forEach(key => {
      certificateData.append(key, formData[key]);
    });
    certificateData.append('studentPicture', studentPicture);

    try {
      const config = { 
        headers: { 
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${user.token}` 
        } 
      };
      await axios.post('http://localhost:5001/api/admin/certificates', certificateData, config);
      setSuccess('Certificate registered successfully!');
      // Reset form after successful submission
      e.target.reset();
      setFormData({
        studentName: '', fatherName: '', surname: '', dateOfBirth: '',
        mobileNumber: '', standard: '', schoolName: '', courseName: '',
      });
      setStudentPicture(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register certificate.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">User Certificate Registration</h1>
      {error && <p className="text-red-500 bg-red-900/20 p-3 rounded-md mb-4">{error}</p>}
      {success && <p className="text-green-500 bg-green-900/20 p-3 rounded-md mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="studentName" placeholder="Student Name" onChange={handleChange} required className="bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="text" name="surname" placeholder="Surname" onChange={handleChange} required className="bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        
        <input type="text" name="fatherName" placeholder="Father's Name" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">Date of Birth</label>
                <input type="date" name="dateOfBirth" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <input type="tel" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required className="self-end bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        
        <hr className="border-gray-600"/>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="standard" placeholder="Standard (e.g., 12th)" onChange={handleChange} required className="bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" name="courseName" placeholder="Course Name (e.g., Science)" onChange={handleChange} required className="bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <input type="text" name="schoolName" placeholder="School Name" onChange={handleChange} required className="w-full bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">Student Picture</label>
          <input type="file" name="studentPicture" onChange={handleFileChange} required className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"/>
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">
          Register Certificate
        </button>
      </form>
    </div>
  );
};

export default RegisterCertificate;
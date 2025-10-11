import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios'; // <-- STEP 1: Import the central API instead of axios
import { AuthContext } from '../../context/AuthContext';
import { FiEdit, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const { user } = useContext(AuthContext);
  
  // State for controlling the delete confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // --- STEP 2: Use API.get with just the endpoint ---
        const { data } = await API.get('/api/admin/students', config);
        setStudents(data);
      } catch (error) {
        console.error('Failed to fetch students', error);
      }
    };
    if (user) {
      fetchStudents();
    }
  }, [user]);
  
  // Function to open the confirmation modal
  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsModalOpen(true);
  };
  
  // Function to close the confirmation modal
  const closeDeleteModal = () => {
    setStudentToDelete(null);
    setIsModalOpen(false);
  };

  // Function to handle the actual deletion
  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // --- STEP 3: Use API.delete with just the endpoint ---
      await API.delete(`/api/admin/students/${studentToDelete._id}`, config);
      
      // Update UI by removing the deleted student from the state
      setStudents(students.filter((student) => student._id !== studentToDelete._id));
      
      // Close the modal after deletion
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete student', error);
      // Optionally, show an error message to the user
      closeDeleteModal();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">Manage Students</h1>
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Full Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">User ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {students.map((student) => (
              <tr key={student._id}>
                <td className="py-3 px-4 text-white">{student.fullName}</td>
                <td className="py-3 px-4 text-gray-300">{student.userId}</td>
                <td className="py-3 px-4">
                  {/* The delete button now opens the modal */}
                  <button onClick={() => openDeleteModal(student)} className="text-red-500 hover:text-red-400">
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-500/10 p-4 rounded-full mb-4">
                <FiAlertTriangle className="text-red-500" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Delete Student</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to permanently delete <strong className="font-medium text-white">{studentToDelete?.fullName}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4 w-full">
                <button
                  onClick={closeDeleteModal}
                  className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
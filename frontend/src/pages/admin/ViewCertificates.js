import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ViewCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5001/api/admin/certificates', config);
        setCertificates(data);
      } catch (error) {
        console.error("Failed to fetch certificates", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchCertificates();
  }, [user]);

  if (isLoading) {
    return <p className="text-center text-gray-400">Loading registered certificates...</p>;
  }

  if (certificates.length === 0) {
    return <p className="text-center text-gray-400">No certificates have been registered yet.</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">Registered Certificates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert._id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
            <div className="w-full h-56 flex items-center justify-center bg-gray-900"> {/* Added a wrapper div */}
              <img 
                src={`http://localhost:5001${cert.studentPicture}`} 
                alt={cert.studentName}
                // ✅ FIX: Changed object-cover to object-contain
                className="max-w-full max-h-full object-contain" 
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white">{cert.studentName} {cert.surname}</h2>
              <p className="text-sm text-gray-400">S/o {cert.fatherName}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-gray-300"><span className="font-semibold">Course:</span> {cert.courseName}</p>
                <p className="text-gray-300"><span className="font-semibold">Standard:</span> {cert.standard}</p>
                <p className="text-gray-300"><span className="font-semibold">School:</span> {cert.schoolName}</p>
                <p className="text-sm text-gray-500 mt-2">Registered on: {new Date(cert.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCertificates;
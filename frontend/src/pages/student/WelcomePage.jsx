import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { AuthContext } from '../../context/AuthContext';

const WelcomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [showInitials, setShowInitials] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Process the profile picture URL
    const processProfilePicture = () => {
      if (!user?.profilePicture) {
        setShowInitials(true);
        return;
      }

      let imagePath = user.profilePicture;
      
      // Normalize path separators
      imagePath = imagePath.replace(/\\/g, '/');
      
      // Remove any leading slash to avoid double slashes in URL
      if (imagePath.startsWith('/')) {
        imagePath = imagePath.substring(1);
      }
      
      // Check if it's the default image or empty
      if (imagePath.includes('default.png') || !imagePath) {
        setShowInitials(true);
        return;
      }
      
      // Check if the path already contains 'uploads'
      if (imagePath.includes('uploads/')) {
        // Extract the correct path after 'uploads'
        const uploadsIndex = imagePath.indexOf('uploads/');
        const correctPath = imagePath.substring(uploadsIndex);
        setProfileImageUrl(`http://localhost:5001/${correctPath}`);
      } else {
        // Handle case where we need to add the uploads directory
        setProfileImageUrl(`http://localhost:5001/uploads/${imagePath}`);
      }
    };

    processProfilePicture();

    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/'); // Redirect to student dashboard
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, user]);

  const handleImageError = () => {
    setShowInitials(true);
  };

  const getInitials = () => {
    if (!user?.fullName) return 'ST';
    return user.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const studentName = user?.fullName || 'Student';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center px-4 py-8">
      {/* Student profile image */}
      <div className="w-48 h-48 rounded-full border-4 border-indigo-500 shadow-2xl overflow-hidden flex items-center justify-center mb-6 bg-gray-800">
        {profileImageUrl && !showInitials ? (
          <img
            src={profileImageUrl}
            alt="Student Profile"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-900">
            <span className="text-white text-4xl font-bold">{getInitials()}</span>
          </div>
        )}
      </div>

      {/* Animated Welcome Text */}
      <div className="typing-container min-h-[120px] mb-4">
        <TypeAnimation
          sequence={[
            `Welcome, ${studentName}!`,
            2000,
            'This Student Exam Management System is Designed and Developed by Krishna Verma',
            4000,
          ]}
          wrapper="h1"
          cursor={true}
          repeat={0}
          speed={60}
          className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500"
        />
      </div>

      

      {/* Countdown timer */}
      <div className="flex items-center justify-center bg-indigo-900 bg-opacity-30 rounded-full py-2 px-6 mb-6">
        <span className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
        <span className="text-gray-300">Redirecting in</span>
        <span className="font-bold mx-1 text-indigo-300">{countdown}</span>
        <span className="text-gray-300">seconds</span>
      </div>

      <p className="text-gray-400 text-lg animate-pulse">
        Preparing your student dashboard...
      </p>
    </div>
  );
};

export default WelcomePage;
// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Common Pages
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Student Pages
import WelcomePage from './pages/student/WelcomePage';
import StudentDashboard from './pages/student/StudentDashboard';
import QuizInstructions from './pages/student/QuizInstructions';
import QuizPage from './pages/student/QuizPage';
import ResultPage from './pages/student/ResultPage'; // Corrected Import

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateStudent from './pages/admin/CreateStudent';
import ManageStudents from './pages/admin/ManageStudents';
import CreateQuiz from './pages/admin/CreateQuiz';
import ViewQuizzes from './pages/admin/ViewQuizzes';
import ViewResults from './pages/admin/ViewResults';
import RegisterCertificate from './pages/admin/RegisterCertificate';
import ViewCertificates from './pages/admin/ViewCertificates';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-900 text-white min-h-screen flex flex-col">
          <Navbar />
          <main className="container mx-auto p-4 mt-4 flex-1">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Student Routes */}
              <Route path="/welcome" element={<ProtectedRoute roles={['student']}><WelcomePage /></ProtectedRoute>} />
              <Route path="/" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/quiz/instructions/:id" element={<ProtectedRoute roles={['student']}><QuizInstructions /></ProtectedRoute>} />
              <Route path="/quiz/take/:id" element={<ProtectedRoute roles={['student']}><QuizPage /></ProtectedRoute>} />
              <Route path="/result" element={<ProtectedRoute roles={['student']}><ResultPage /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/create-student" element={<ProtectedRoute roles={['admin']}><CreateStudent /></ProtectedRoute>} />
              <Route path="/admin/manage-students" element={<ProtectedRoute roles={['admin']}><ManageStudents /></ProtectedRoute>} />
              <Route path="/admin/create-quiz" element={<ProtectedRoute roles={['admin']}><CreateQuiz /></ProtectedRoute>} />
              <Route path="/admin/view-quizzes" element={<ProtectedRoute roles={['admin']}><ViewQuizzes /></ProtectedRoute>} />
              <Route path="/admin/view-results" element={<ProtectedRoute roles={['admin']}><ViewResults /></ProtectedRoute>} />
              <Route path="/admin/register-certificate" element={<ProtectedRoute roles={['admin']}><RegisterCertificate /></ProtectedRoute>} />
              <Route path="/admin/view-certificates" element={<ProtectedRoute roles={['admin']}><ViewCertificates /></ProtectedRoute>} />

            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BrowseBooks from './pages/BrowseBooks';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("React Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-red-500 bg-dark min-h-screen">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BrowseBooks />} />

        {/* Guest Only Routes (Redirect to Home if logged in) */}
        <Route element={<ProtectedRoute guestOnly={true} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Student/User Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-dark flex flex-col">
          <Navbar />
          <main className="flex-grow pt-16">
            <AnimatedRoutes />
          </main>
          <ToastContainer position="top-right" theme="dark" />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

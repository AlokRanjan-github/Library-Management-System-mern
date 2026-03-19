import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSignOutAlt, FaCog, FaBook, FaHome, FaThLarge, FaBookOpen, FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [userName, setUserName] = useState(localStorage.getItem('name') || '');
  const user = token ? { token, role, name: userName } : null;

  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get first name for display
  const firstName = user?.name ? user.name.split(' ')[0] : (user?.role === 'admin' ? 'Admin' : 'Student');

  // Fetch name if token exists but name is missing
  useEffect(() => {
    if (token && !userName) {
      const fetchProfile = async () => {
        try {
          const { authService } = await import('../services/api');
          const profile = await authService.getUserProfile();
          if (profile.name) {
            setUserName(profile.name);
            localStorage.setItem('name', profile.name);
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };
      fetchProfile();
    }
  }, [token, userName]);

  // Close dropdowns on route change or outside click
  useEffect(() => {
    const closeMenus = () => {
      setIsMobileMenuOpen(false);
      setIsProfileDropdownOpen(false);
    };
    closeMenus();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.info('Logged out successfully');
    window.location.reload();
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome className="mr-2" /> },
    { name: 'Browse Books', path: '/books', icon: <FaBook className="mr-2" /> },
  ];

  if (user) {
    navLinks.push({
      name: 'Dashboard',
      path: user.role === 'admin' ? '/dashboard/admin' : '/dashboard/student',
      icon: <FaThLarge className="mr-2" />
    });

    if (user.role === 'admin') {
      navLinks.push({
        name: 'Admin Panel',
        path: '/dashboard/admin',
        icon: <FaShieldAlt className="mr-2" />,
        isAdmin: true
      });
    }
  }

  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <FaBookOpen className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Code Stack Lib
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center transition-colors text-sm font-medium py-2 ${
                  link.isAdmin 
                    ? 'text-red-400 hover:text-red-300' 
                    : (location.pathname === link.path ? 'text-accent' : 'text-slate-300 hover:text-white')
                }`}
              >
                {link.icon}
                {link.name}
                {location.pathname === link.path && !link.isAdmin && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-accent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {!user ? (
              <div className="flex items-center space-x-4 ml-4 border-l border-slate-700 pl-4">
                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-primary/20">
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4 border-l border-slate-700 pl-4" ref={dropdownRef}>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => { setIsProfileDropdownOpen(!isProfileDropdownOpen); }}
                    className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors p-1 pr-3 rounded-full hover:bg-slate-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      {user.name ? user.name.charAt(0).toUpperCase() : (user.role === 'admin' ? 'A' : 'S')}
                    </div>
                    <span className="text-sm font-semibold tracking-wide">
                      Hi, {firstName}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-700 mb-1">
                          <p className="text-sm text-white font-medium">Logged in as</p>
                          <p className="text-xs text-slate-400 capitalize bg-slate-700 inline-block px-2 py-0.5 rounded mt-1">{user.role}</p>
                        </div>
                        <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                          <FaCog className="mr-3" /> Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-100 hover:bg-red-600/20 hover:text-red-400 transition-colors text-left"
                        >
                          <FaSignOutAlt className="mr-3" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    link.isAdmin 
                      ? 'text-red-400 border border-red-400/20 bg-red-400/5' 
                      : (location.pathname === link.path ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white')
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {!user ? (
                <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
                  <Link to="/login" className="block w-full text-center px-4 py-2 text-slate-300 hover:text-white font-medium bg-slate-800 rounded-md">
                    Login
                  </Link>
                  <Link to="/register" className="block w-full text-center px-4 py-2 bg-primary text-white font-medium rounded-md">
                    Register
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
                  <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

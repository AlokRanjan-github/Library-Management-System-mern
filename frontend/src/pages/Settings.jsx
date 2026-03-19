import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import PageTransition from '../components/animations/PageTransition';
import AnimatedButton from '../components/animations/AnimatedButton';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaBook } from 'react-icons/fa';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getUserProfile();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: '',
          confirmPassword: '',
          course: data.course || ''
        });
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to load profile data';
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setUpdating(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        course: role === 'student' ? formData.course : undefined
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      await authService.updateUserProfile(updateData);
      toast.success('Profile updated successfully');
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <PageTransition className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 border-b border-slate-700">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <FaUser className="mr-4 text-accent" /> Account Settings
          </h1>
          <p className="text-slate-400 mt-2">Manage your personal information and security settings.</p>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-l-4 border-primary pl-4">Personal Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Full Name</label>
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder-slate-600"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Email Address</label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder-slate-600"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Course</label>
                    <div className="relative group">
                      <FaBook className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder-slate-600"
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-l-4 border-secondary pl-4">Security</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">New Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder-slate-600"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Confirm New Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder-slate-600"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700 flex justify-end">
            <AnimatedButton
              type="submit"
              disabled={updating}
              className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Save Changes'}
            </AnimatedButton>
          </div>
        </form>
      </div>
    </PageTransition>
  );
};

export default Settings;

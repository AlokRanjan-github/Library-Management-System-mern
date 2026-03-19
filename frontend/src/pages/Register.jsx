import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/animations/PageTransition';
import AnimatedButton from '../components/animations/AnimatedButton';
import { authService } from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
// Removed unused login hook call

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.registerUser({ name, email, password, course });
      toast.success('Registration successful! Welcome to the library.');
      // authService already handles localStorage for token, role, and name
      navigate('/dashboard/student');
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to register. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="flex items-center justify-center bg-dark p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl overflow-hidden p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Course (if Student)</label>
            <input 
              type="text" 
              required
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="••••••••"
            />
          </div>
          <AnimatedButton 
            type="submit" 
            disabled={loading}
            className="w-full py-2 px-4 bg-secondary hover:bg-purple-600 text-white rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </AnimatedButton>
        </form>
        <p className="mt-6 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-sky-400">
            Sign in
          </Link>
        </p>
      </div>
    </PageTransition>
  );
};

export default Register;

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/animations/PageTransition';
import AnimatedButton from '../components/animations/AnimatedButton';
import { authService } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
// Removed unused login hook call

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.loginUser({ email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/student');
      }
      toast.success(`Welcome back, ${data.role}!`);
      // Force reload to update Navbar (since no context remains)
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to login. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="flex items-center justify-center bg-dark p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl overflow-hidden p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full py-2 px-4 bg-primary hover:bg-blue-600 text-white rounded-md font-medium transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </AnimatedButton>
        </form>
        <p className="mt-6 text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:text-sky-400">
            Sign up
          </Link>
        </p>
      </div>
    </PageTransition>
  );
};

export default Login;

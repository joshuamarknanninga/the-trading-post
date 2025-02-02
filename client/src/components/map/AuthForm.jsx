import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AuthForm({ mode = 'login' }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: mode === 'register' ? '' : undefined,
    confirmPassword: mode === 'register' ? '' : undefined
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register(formData.email, formData.password, formData.name);
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 p-3 bg-red-50 rounded-lg">{error}</div>}

        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? <LoadingSpinner size={6} /> : null}
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </button>

        <div className="text-center mt-4">
          {mode === 'login' ? (
            <>
              <span className="text-gray-600">New user? </span>
              <Link to="/register" className="text-green-600 hover:underline">
                Create an account
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-green-600 hover:underline">
                Log in here
              </Link>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
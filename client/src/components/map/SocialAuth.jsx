import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const SocialAuth = ({ onSuccess, onError }) => {
  const { socialLogin } = useAuth();
  const [isLoading, setIsLoading] = useState({
    google: false,
    facebook: false,
    github: false
  });

  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(prev => ({ ...prev, [provider]: true }));
      await socialLogin(provider);
      onSuccess?.();
    } catch (error) {
      onError?.(error.message || 'Social login failed');
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleSocialLogin('google')}
        disabled={isLoading.google}
        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
      >
        {isLoading.google ? (
          <LoadingSpinner size={6} color="white" />
        ) : (
          <>
            <FaGoogle />
            Continue with Google
          </>
        )}
      </button>

      <button
        onClick={() => handleSocialLogin('facebook')}
        disabled={isLoading.facebook}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
      >
        {isLoading.facebook ? (
          <LoadingSpinner size={6} color="white" />
        ) : (
          <>
            <FaFacebook />
            Continue with Facebook
          </>
        )}
      </button>

      <button
        onClick={() => handleSocialLogin('github')}
        disabled={isLoading.github}
        className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 disabled:bg-gray-600 transition-colors"
      >
        {isLoading.github ? (
          <LoadingSpinner size={6} color="white" />
        ) : (
          <>
            <FaGithub />
            Continue with GitHub
          </>
        )}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>
    </div>
  );
};

export default SocialAuth;
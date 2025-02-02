import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function SocialAuth() {
  const { socialLogin } = useAuth();

  const handleSocialLogin = async (provider) => {
    try {
      await socialLogin(provider);
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleSocialLogin('google')}
        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
      >
        <FaGoogle /> Continue with Google
      </button>

      <button
        onClick={() => handleSocialLogin('facebook')}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        <FaFacebook /> Continue with Facebook
      </button>
    </div>
  );
}
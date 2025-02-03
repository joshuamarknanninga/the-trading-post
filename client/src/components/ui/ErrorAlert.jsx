import { useEffect, useState } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

const ErrorAlert = ({ message, onClose, timeout = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, timeout);

    return () => clearTimeout(timer);
  }, [message, timeout, onClose]);

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center">
          <FiAlertCircle className="w-6 h-6 text-red-400 mr-3" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{message}</p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
            className="text-red-500 hover:text-red-700 ml-3"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
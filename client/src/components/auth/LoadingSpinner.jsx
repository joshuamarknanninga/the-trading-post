export default function LoadingSpinner({ size = 8, color = 'green' }) {
    const colorClasses = {
      green: 'border-green-500',
      white: 'border-white',
      gray: 'border-gray-400'
    };
  
    return (
      <div className={`flex justify-center items-center h-${size} w-${size}`}>
        <div
          className={`animate-spin rounded-full h-full w-full border-t-2 border-b-2 ${colorClasses[color]}`}
        ></div>
      </div>
    );
  }
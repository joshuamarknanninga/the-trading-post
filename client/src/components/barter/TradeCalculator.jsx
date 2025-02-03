import { useState } from 'react';
import { FiDollarSign, FiArrowRight } from 'react-icons/fi';

const TradeCalculator = ({ userItems, targetItem }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [fairnessRating, setFairnessRating] = useState(0);

  const calculateFairness = () => {
    const userTotal = selectedItems.reduce((sum, item) => sum + item.value, 0);
    const targetValue = targetItem.value;
    const difference = Math.abs(userTotal - targetValue);
    const rating = Math.max(0, 100 - (difference / targetValue * 100));
    setFairnessRating(Math.round(rating));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-4">Trade Calculator</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="font-medium">Your Items:</p>
          {userItems.map(item => (
            <label key={item._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.some(i => i._id === item._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems([...selectedItems, item]);
                  } else {
                    setSelectedItems(selectedItems.filter(i => i._id !== item._id));
                  }
                }}
              />
              {item.title} (${item.value})
            </label>
          ))}
        </div>
        
        <div className="text-center">
          <FiArrowRight className="w-8 h-8 mx-auto mt-4 text-gray-400" />
          <button
            onClick={calculateFairness}
            className="mt-4 btn-primary"
          >
            Calculate Fairness
          </button>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Target Item:</p>
          <div className="p-2 bg-gray-50 rounded">
            {targetItem.title} (${targetItem.value})
          </div>
          <div className="mt-4">
            <p className="flex items-center gap-1">
              <FiDollarSign />
              Fairness Rating:
            </p>
            <div className="text-2xl font-bold">
              {fairnessRating}%
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className={`h-full rounded-full ${
                    fairnessRating >= 80 ? 'bg-green-500' :
                    fairnessRating >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${fairnessRating}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeCalculator;
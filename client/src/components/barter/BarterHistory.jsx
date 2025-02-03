import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FiRepeat, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const BarterHistory = () => {
  const { user } = useAuth();
  const [barters, setBarters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarters = async () => {
      try {
        const { data } = await axios.get('/api/barter/history', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBarters(data);
      } catch (error) {
        console.error('Error fetching barter history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBarters();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Barter History</h2>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading barter history...</div>
        ) : barters.length === 0 ? (
          <div className="text-center py-4">No barter history found</div>
        ) : (
          barters.map((barter) => (
            <div key={barter._id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FiRepeat className="text-green-600" />
                  <h3 className="font-medium">{barter.status}</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(barter.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Your Items:</p>
                  {barter.offeredItems.map(item => (
                    <div key={item._id} className="text-gray-600">
                      {item.title} (${item.value})
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-medium">Received Items:</p>
                  {barter.requestedItems.map(item => (
                    <div key={item._id} className="text-gray-600">
                      {item.title} (${item.value})
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-2 flex items-center gap-2">
                {barter.status === 'completed' ? (
                  <FiCheckCircle className="text-green-500" />
                ) : (
                  <FiXCircle className="text-red-500" />
                )}
                <span className="text-sm">
                  {barter.status === 'completed' 
                    ? 'Trade completed successfully'
                    : 'Trade was canceled'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BarterHistory;
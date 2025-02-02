import { useState } from 'react';
import { useUserListings } from '../hooks/useListings';

export default function BarterOfferModal({ listing, onClose, onSubmit }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [offerMessage, setOfferMessage] = useState('');
  const { listings: userListings, loading } = useUserListings();

  const handleSubmit = () => {
    onSubmit({
      offeredItems: selectedItems,
      message: offerMessage,
      targetListing: listing.id
    });
    onClose();
  };

  const toggleItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Propose Trade for {listing.title}</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-3">Your Offer:</h3>
          {loading ? (
            <div className="text-center py-4">Loading your listings...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userListings.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedItems.includes(item.id) 
                      ? 'border-green-500 bg-green-50' 
                      : 'hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      readOnly
                      className="h-4 w-4"
                    />
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">Message to Seller</label>
          <textarea
            value={offerMessage}
            onChange={(e) => setOfferMessage(e.target.value)}
            className="w-full p-2 border rounded-lg h-24"
            placeholder="Add a message explaining your offer..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="btn-primary"
            disabled={selectedItems.length === 0}
          >
            Submit Trade Offer
          </button>
        </div>
      </div>
    </div>
  );
}
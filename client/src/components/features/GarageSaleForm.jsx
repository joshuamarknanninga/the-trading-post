import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const GarageSaleForm = ({ show, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    date: '',
    time: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Geocoding would be handled here
    onSubmit({
      ...formData,
      location: { lat: 37.7749, lng: -122.4194 } // Temporary coordinates
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Garage Sale</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded h-24"
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Submit Garage Sale
          </button>
        </form>
      </div>
    </div>
  );
};

export default GarageSaleForm;
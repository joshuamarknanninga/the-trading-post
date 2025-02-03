import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import LoadingSpinner from '../ui/LoadingSpinner';
import ConfirmationModal from '../ui/ConfirmationModal';

const ListingsManager = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingListing, setEditingListing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);

  const categories = [
    'all',
    'eggs',
    'vegetables',
    'dairy',
    'meat',
    'services',
    'pdf',
    'other'
  ];

  const fetchListings = async () => {
    try {
      const response = await fetch(
        `/api/listings?page=${currentPage}&search=${searchTerm}&category=${selectedCategory}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      setListings(data.listings);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchListings();
    }
  }, [currentPage, searchTerm, selectedCategory, user]);

  const handleUpdateListing = async (listingId, updatedData) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedData),
      });
      
      if (response.ok) {
        setListings(listings.map(listing => 
          listing._id === listingId ? { ...listing, ...updatedData } : listing
        ));
        setEditingListing(null);
      }
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  const handleDeleteListing = async () => {
    try {
      const response = await fetch(`/api/listings/${selectedListingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (response.ok) {
        setListings(listings.filter(listing => listing._id !== selectedListingId));
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Manage Listings</h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search listings..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <select
            className="w-full md:w-48 p-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size={12} />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Seller</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {listings.map((listing) => (
                  <tr key={listing._id}>
                    <td className="px-6 py-4">
                      {editingListing?._id === listing._id ? (
                        <input
                          type="text"
                          className="w-full p-1 border rounded"
                          value={editingListing.title}
                          onChange={(e) => setEditingListing({
                            ...editingListing,
                            title: e.target.value
                          })}
                        />
                      ) : (
                        listing.title
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingListing?._id === listing._id ? (
                        <select
                          className="p-1 border rounded"
                          value={editingListing.category}
                          onChange={(e) => setEditingListing({
                            ...editingListing,
                            category: e.target.value
                          })}
                        >
                          {categories.filter(c => c !== 'all').map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        listing.category
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingListing?._id === listing._id ? (
                        <input
                          type="number"
                          className="w-20 p-1 border rounded"
                          value={editingListing.price}
                          onChange={(e) => setEditingListing({
                            ...editingListing,
                            price: e.target.value
                          })}
                        />
                      ) : (
                        `$${listing.price}`
                      )}
                    </td>
                    <td className="px-6 py-4">{listing.seller?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        listing.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {editingListing?._id === listing._id ? (
                        <>
                          <button
                            onClick={() => handleUpdateListing(listing._id, editingListing)}
                            className="text-green-600 hover:text-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingListing(null)}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingListing(listing)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedListingId(listing._id);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-secondary"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteListing}
        title="Confirm Delete"
        message="Are you sure you want to delete this listing? This action cannot be undone."
      />
    </div>
  );
};

export default ListingsManager;
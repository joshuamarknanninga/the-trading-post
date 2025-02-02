import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      // TODO: Connect to your backend API
      console.log('Saving profile:', profileData);
      alert('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {editMode ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          {editMode ? (
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-lg">{profileData.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <p className="p-2 bg-gray-50 rounded-lg">{profileData.email}</p>
        </div>

        {/* Location Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          {editMode ? (
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-lg">{profileData.location}</p>
          )}
        </div>

        {/* Bio Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          {editMode ? (
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full p-2 border rounded-lg h-32"
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded-lg whitespace-pre-line">
              {profileData.bio || 'No bio provided'}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Listings</h2>
        <div className="space-y-4">
          {/* TODO: Fetch user's listings from API */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            You don't have any active listings yet. 
            <a href="/sell" className="ml-2 text-green-600 hover:underline">
              Create your first listing
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-4">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
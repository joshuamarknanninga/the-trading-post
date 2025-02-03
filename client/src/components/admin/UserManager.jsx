import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import LoadingSpinner from '../ui/LoadingSpinner';

const UserManager = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [roleUpdate, setRoleUpdate] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) fetchUsers();
  }, [user]);

  const updateUserRole = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, 
        { role: roleUpdate },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: roleUpdate } : u
      ));
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (!user?.isAdmin) return (
    <div className="text-center p-4">Admin access required</div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-8 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-2 top-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size={12} />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.filter(u => 
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {editingUserId === user._id ? (
                      <select
                        value={roleUpdate}
                        onChange={(e) => setRoleUpdate(e.target.value)}
                        className="border rounded p-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {editingUserId === user._id ? (
                      <>
                        <button
                          onClick={() => updateUserRole(user._id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingUserId(user._id);
                            setRoleUpdate(user.role);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManager;
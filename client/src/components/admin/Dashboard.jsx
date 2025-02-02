import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiPackage, FiDollarSign, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    transactions: 0,
    revenue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  // Sample data - replace with API calls
  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2h ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '4h ago' }
  ];

  const recentProducts = [
    { id: 1, title: 'Organic Eggs', price: 4.99, seller: 'Farm Fresh' },
    { id: 2, title: 'DIY Guide PDF', price: 9.99, seller: 'Tech Guru' }
  ];

  useEffect(() => {
    // TODO: Fetch actual data from API
    setStats({
      users: 1423,
      products: 856,
      transactions: 234,
      revenue: 5824.76
    });

    setRecentActivities([
      { type: 'user', action: 'signed up', time: '2m ago' },
      { type: 'product', action: 'was listed', time: '15m ago' },
      { type: 'transaction', action: 'completed', time: '30m ago' }
    ]);
  }, []);

  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p>You don't have permission to view this page.</p>
        <Link to="/" className="btn-primary mt-4 inline-block">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <span className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<FiUsers className="w-6 h-6" />}
          title="Total Users"
          value={stats.users}
          trend="+12% from last month"
        />
        <StatCard 
          icon={<FiPackage className="w-6 h-6" />}
          title="Active Listings"
          value={stats.products}
          trend="+5 new today"
        />
        <StatCard 
          icon={<FiDollarSign className="w-6 h-6" />}
          title="Total Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          trend="30d average: $194.16"
        />
        <StatCard 
          icon={<FiActivity className="w-6 h-6" />}
          title="Transactions"
          value={stats.transactions}
          trend="87% success rate"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-4">
            {recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className="text-sm text-gray-500">{user.joined}</span>
              </div>
            ))}
          </div>
          <Link to="/admin/users" className="btn-secondary mt-4 block text-center">
            View All Users
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Listings</h3>
          <div className="space-y-4">
            {recentProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-gray-600">by {product.seller}</p>
                </div>
                <span className="text-sm font-medium">${product.price}</span>
              </div>
            ))}
          </div>
          <Link to="/admin/listings" className="btn-secondary mt-4 block text-center">
            Manage Listings
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link 
          to="/admin/users" 
          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
        >
          <FiUsers className="w-8 h-8 mx-auto mb-2" />
          User Management
        </Link>
        <Link 
          to="/admin/listings" 
          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
        >
          <FiPackage className="w-8 h-8 mx-auto mb-2" />
          Content Moderation
        </Link>
        <Link 
          to="/admin/transactions" 
          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
        >
          <FiDollarSign className="w-8 h-8 mx-auto mb-2" />
          Transactions
        </Link>
        <Link 
          to="/admin/settings" 
          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
        >
          <FiActivity className="w-8 h-8 mx-auto mb-2" />
          System Settings
        </Link>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-green-100 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <span className="text-sm text-green-600">{trend}</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
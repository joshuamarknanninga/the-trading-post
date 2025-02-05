import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiMap, FiUser, FiLogIn, FiLogOut, FiPlusCircle, FiBook } from 'react-icons/fi';
import AuthProvider, { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import InteractiveMap from './components/map/InteractiveMap';
import CheckoutWizard from './components/transactions/CheckoutWizard';
import PdfLibrary from './components/library/PdfLibrary';
import LoadingSpinner from './components/auth/LoadingSpinner';
import ErrorAlert from './components/ui/ErrorAlert';
import SocialAuth from './components/auth/SocialAuth';
import ConfirmationModal from './components/ui/ConfirmationModal';

export default function App() {
  const [error, setError] = useState(null);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* <Route path="/marketplace" element={<MarketplacePage />} /> */}
              <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              {/* <Route path="/register" element={<RegisterPage />} /> */}
              <Route path="/map" element={<InteractiveMap />} />
              <Route path="/pdf-library" element={<PdfLibrary />} />
              <Route path="/checkout/:listingId" element={<CheckoutWizard />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <ConfirmationModal />
          <ErrorAlert message={error} onClose={() => setError(null)} />
        </div>
      </Router>
    </AuthProvider>
  );
}

// NavBar Component
function NavBar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-green-600">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            LocalBazaar
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" icon={<FiHome />} text="Home" />
            <NavLink to="/marketplace" icon={<FiShoppingCart />} text="Marketplace" />
            <NavLink to="/map" icon={<FiMap />} text="Local Map" />
            <NavLink to="/pdf-library" icon={<FiBook />} text="PDF Library" />
            
            {user ? (
              <>
                <NavLink to="/sell" icon={<FiPlusCircle />} text="Sell Items" />
                <NavLink to="/profile" icon={<FiUser />} text="Profile" />
                <button onClick={logout} className="flex items-center gap-1 text-red-600 hover:text-red-700">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" icon={<FiLogIn />} text="Login" />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <MobileNavLink to="/" icon={<FiHome />} text="Home" />
            <MobileNavLink to="/marketplace" icon={<FiShoppingCart />} text="Marketplace" />
            <MobileNavLink to="/map" icon={<FiMap />} text="Local Map" />
            <MobileNavLink to="/pdf-library" icon={<FiBook />} text="PDF Library" />
            
            {user ? (
              <>
                <MobileNavLink to="/sell" icon={<FiPlusCircle />} text="Sell Items" />
                <MobileNavLink to="/profile" icon={<FiUser />} text="Profile" />
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <MobileNavLink to="/login" icon={<FiLogIn />} text="Login" />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

// Page Components
function HomePage() {
  return (
    <div className="space-y-8">
      <section className="bg-green-50 rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Trade Local, Grow Together</h1>
        <p className="text-gray-600 mb-6">Connect with your community for fresh produce, goods, and services</p>
        <div className="flex justify-center gap-4">
          <Link to="/marketplace" className="btn-primary">Browse Listings</Link>
          <Link to="/sell" className="btn-secondary">Sell Items</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard 
          title="Fresh Produce"
          description="Find locally grown fruits, vegetables, eggs, and dairy"
          icon="🥚"
        />
        <FeatureCard 
          title="Local Services"
          description="Trade skills and services with your neighbors"
          icon="🔧"
        />
        <FeatureCard 
          title="Community Market"
          description="Join garage sales and local events"
          icon="🎪"
        />
      </section>
    </div>
  );
}

function SellPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'other'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit logic here
      console.log('Submitting:', formData);
      alert('Listing created successfully!');
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded-lg h-32"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="eggs">Eggs</option>
              <option value="vegetables">Vegetables</option>
              <option value="dairy">Dairy</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          Publish Listing
        </button>
      </form>
    </div>
  );
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || ''
  });

  const handleSave = async () => {
    try {
      // Save profile logic
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className="btn-primary"
        >
          {editMode ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <ProfileField 
          label="Name"
          value={profileData.name}
          editMode={editMode}
          onChange={(value) => setProfileData({ ...profileData, name: value })}
        />
        <ProfileField 
          label="Email"
          value={profileData.email}
          editMode={editMode}
          onChange={(value) => setProfileData({ ...profileData, email: value })}
        />
        <ProfileField 
          label="Location"
          value={profileData.location}
          editMode={editMode}
          onChange={(value) => setProfileData({ ...profileData, location: value })}
        />
      </div>

      <div className="mt-8">
        <button
          onClick={logout}
          className="btn-secondary w-full"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials.email, credentials.password);
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 p-3 bg-red-50 rounded-lg">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Log In
        </button>

        <SocialAuth />

        <div className="text-center mt-4">
          <span className="text-gray-600">New user? </span>
          <Link to="/register" className="text-green-600 hover:underline">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}

// Helper Components
function NavLink({ to, icon, text }) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors"
    >
      {icon} {text}
    </Link>
  );
}

function MobileNavLink({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100"
    >
      {icon} {text}
    </Link>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ProfileField({ label, value, editMode, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {editMode ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      ) : (
        <p className="p-2 bg-gray-50 rounded-lg">{value || 'Not provided'}</p>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12 py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} LocalBazaar. All rights reserved.</p>
        <div className="mt-2">
          <Link to="/privacy" className="text-gray-400 hover:text-white mx-2">Privacy Policy</Link>
          <Link to="/terms" className="text-gray-400 hover:text-white mx-2">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link to="/" className="btn-primary inline-block">Return Home</Link>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiMap, FiUser, FiLogIn, FiLogOut, FiPlusCircle } from 'react-icons/fi';
import AuthProvider, { useAuth } from './context/AuthContext';
import { SellPage } from './pages/SellPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthForm from './components/auth/AuthForm';
import InteractiveMap from './components/map/InteractiveMap';
import CheckoutWizard from './components/transactions/CheckoutWizard';
import Dashboard from './components/admin/Dashboard';

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/map" element={<InteractiveMap />} />
              <Route path="/checkout/:listingId" element={<CheckoutWizard />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Navigation Bar Component
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

function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch listings from API
    setTimeout(() => {
      setListings(sampleListings);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Local Marketplace</h2>
        <select className="p-2 border rounded-lg">
          <option>Newest First</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
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

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Add other page components (SellPage, ProfilePage, LoginPage, etc.) similarly

// Styled Components
const sampleListings = [
  { id: 1, title: 'Fresh Chicken Eggs', price: 4.99, location: '0.5mi away', category: '🥚 Eggs' },
  { id: 2, title: 'Organic Tomatoes', price: 3.49, location: '1.2mi away', category: '🥕 Produce' },
  { id: 3, title: 'Yard Work Help', price: 'Barter', location: '0.8mi away', category: '🔧 Services' },
];

function ListingCard({ listing }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{listing.title}</h3>
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
            {listing.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
        <p className="text-xl font-bold text-green-600">
          {typeof listing.price === 'number' ? `$${listing.price}` : listing.price}
        </p>
      </div>
      <div className="border-t p-4 bg-gray-50">
        <button className="btn-secondary w-full">View Details</button>
      </div>
    </div>
  );
}

// Add the rest of the components (ProfilePage, SellPage, etc.) following similar patterns
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'services', label: 'Services' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchTerm}&category=${selectedCategory}&min=${priceRange[0]}&max=${priceRange[1]}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search Term</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="What are you looking for?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setPriceRange([0, 1000]);
            setSelectedCategory('all');
          }}
          className="btn-secondary"
        >
          Clear
        </button>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </div>
    </form>
  );
}
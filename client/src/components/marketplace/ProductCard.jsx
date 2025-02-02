import { Link } from 'react-router-dom';
import { FiHeart, FiDollarSign } from 'react-icons/fi';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-square">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
          <FiHeart className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">
            <Link to={`/products/${product.id}`} className="hover:text-green-600">
              {product.title}
            </Link>
          </h3>
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <FiDollarSign className="flex-shrink-0" />
          <span className="font-bold text-xl">{product.price}</span>
          {product.originalPrice && (
            <span className="line-through text-gray-400">{product.originalPrice}</span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{product.location}</span>
          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>

        {product.isBarterAllowed && (
          <div className="mt-3 border-t pt-3">
            <span className="text-sm text-green-600">Barter options available</span>
          </div>
        )}
      </div>
    </div>
  );
}
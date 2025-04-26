import React, { useState } from 'react';
import { LuBell, LuShoppingCart } from 'react-icons/lu'; // Using Lucide icons as they seem to be installed
import { useProducts } from '../context/ProductContext'; // Added import
import { useCart } from '../context/CartContext'; // Added import
import { useNotifications } from '../context/NotificationContext'; // Added import

// Define static categories based on the image
const categories = [
  'All', 
  'Antique', 
  'Vintage Furniture', 
  'Crystal & Glass', 
  'Decorative Accents', 
  'Lighting & Mirrors', 
  'Tableware', 
  'Wall Art', 
  'Antique Books',
  'Garden & Outdoor', 
  'Textiles', 
  'Others'
];

const Shop: React.FC = () => {
  // Call context hooks (even if not fully used yet)
  const { products, categories: productCategories } = useProducts(); // Renamed fetched categories
  const { addToCart, getItemCount, getCartTotal, clearCart } = useCart();
  const { addNotification } = useNotifications();

  const [selectedCategory, setSelectedCategory] = useState('All');
  // const itemCount = 6184; // Removed hardcoded count, will use getItemCount later

  // Determine categories to display - Use fetched if available, otherwise static
  const displayCategories = productCategories && productCategories.length > 0 ? productCategories : categories;

  // Filter products based on selected category (using fetched products)
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  // TODO: Add product display logic using filteredProducts
  // TODO: Connect cart button to show cart functionality
  // TODO: Use getItemCount() for cart badge (if re-enabled)

  return (
    <div className="min-h-screen bg-[#F5F1EA] py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-[#46392d]">
            Shop Our Collection
          </h1>
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <button className="relative text-[#46392d] hover:text-[#5c4b3d]">
              <LuBell size={24} />
              {/* Optional: Add notification badge if needed */}
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span> */}
            </button>
            
            {/* Cart Icon */}
            <button
              className="relative bg-[#46392d] text-white p-3 rounded-md hover:bg-[#5c4b3d] transition-colors"
            >
              <LuShoppingCart size={24} />
              {/* The notification badge span below will be removed
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )} */}
            </button>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {displayCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-md text-sm transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-[#46392d] text-[#F5F1EA] shadow-sm' // Dark brown for selected
                  : 'bg-white text-[#46392d] border border-[#46392d]/20 hover:bg-[#46392d]/5' // White background for others
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid Placeholder - Add product listing logic here */}
        <div className="text-center text-[#46392d]/70">
          {/* Render filtered products here */}
          {filteredProducts.length > 0 ? (
            <p>{filteredProducts.length} products found for category "{selectedCategory}". (Display logic needed)</p>
          ) : (
            <p>No products found for category "{selectedCategory}".</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Shop; 
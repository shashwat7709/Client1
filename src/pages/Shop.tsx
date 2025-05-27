import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationIcon from '../components/NotificationIcon';
import PaymentModal from '../components/PaymentModal';
import Cart from '../components/Cart';
import OfferModal from '../components/OfferModal';
import ContactOwnerModal from '../components/ContactOwnerModal';

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { products, categories, isLoading, loadError } = useProducts();
  const { addToCart, getItemCount, getCartTotal, clearCart } = useCart();
  const { addNotification } = useNotifications();

  // Add detailed logging
  useEffect(() => {
    console.log('Shop component mounted');
    console.log('Initial products:', products);
    console.log('Initial categories:', categories);
    console.log('Loading state:', isLoading);
    console.log('Load error:', loadError);
  }, []);

  // Add logging for products updates
  useEffect(() => {
    console.log('Products updated in Shop:', products);
  }, [products]);

  useEffect(() => {
    if (products && products.length > 0) {
      const indices: { [key: string]: number } = {};
      products.forEach(product => {
        indices[product.id] = 0;
      });
      setCurrentImageIndices(indices);
    }
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<null | { id: string; title: string; price: number }>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCartCheckout, setIsCartCheckout] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedProductForContact, setSelectedProductForContact] = useState<null | { title: string }>(null);
  const [selectedProductForOffer, setSelectedProductForOffer] = useState<null | {
    id: string;
    title: string;
    price: number;
    images: string[];
    description: string;
  }>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: string]: number }>({});

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  // Add logging for filtered products
  console.log('Filtered products:', filteredProducts);

  const handleAddToCart = (product: { id: string; title: string; price: number; images: string[] }) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'
    });
    addNotification(`${product.title} added to cart!`, 'success', false);
  };

  const handleCheckout = () => {
    setIsCartCheckout(true);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    if (isCartCheckout) {
      addNotification('Thank you for your purchase! You will receive an email with shipping details.', 'success', true);
      clearCart();
    } else if (selectedProduct) {
      addNotification(`Thank you for purchasing ${selectedProduct.title}! You will receive an email with shipping details.`, 'success', true);
    }
    setSelectedProduct(null);
    setIsCartCheckout(false);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/shop/product/${productId}`);
  };

  const handlePrevImage = (e: React.MouseEvent, productId: string, images: string[]) => {
    e.stopPropagation();
    setCurrentImageIndices(prev => ({
      ...prev,
      [productId]: prev[productId] > 0 ? prev[productId] - 1 : images.length - 1
    }));
  };

  const handleNextImage = (e: React.MouseEvent, productId: string, images: string[]) => {
    e.stopPropagation();
    setCurrentImageIndices(prev => ({
      ...prev,
      [productId]: prev[productId] < images.length - 1 ? prev[productId] + 1 : 0
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1EA] py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46392d] mx-auto mb-4"></div>
          <p className="text-[#46392d] text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F5F1EA] py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {loadError}</span>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EA] py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-[#46392d]">
            Shop Our Collection
          </h1>
          <div className="flex items-center space-x-4">
            <NotificationIcon />
            <Link to="/cart" className="relative text-[#46392d] hover:text-[#5c4b3d] transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-md transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#46392d] text-[#F5F1EA]'
                    : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.images && product.images.length > 0 
                    ? product.images[currentImageIndices[product.id]] 
                    : '/placeholder.svg'}
                  alt={product.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePrevImage(e, product.id, product.images);
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100 z-10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#46392d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNextImage(e, product.id, product.images);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100 z-10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#46392d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {product.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndices[product.id]
                              ? 'bg-white'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif text-[#46392d] mb-2">{product.title}</h3>
                <p className="text-[#46392d]/70 mb-4">{product.subject}</p>
                <div className="flex flex-col space-y-3">
                  <span className="text-xl font-medium text-[#46392d]">
                    ₹{product.price}
                  </span>
                  <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-gray-100 text-[#46392d] px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart(product);
                        navigate('/cart');
                      }}
                      className="bg-[#46392d] text-white px-4 py-2 rounded-md hover:bg-[#5c4b3d] transition-colors"
                    >
                      Buy Now
                    </button>
                    <button
                      className="bg-[#46392d]/10 text-[#46392d] px-4 py-2 rounded-md hover:bg-[#46392d]/20 transition-colors"
                      onClick={() => {
                        setSelectedProductForOffer({
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          images: product.images,
                          description: product.description
                        });
                        setShowOfferModal(true);
                      }}
                    >
                      Your Offer
                    </button>
                  </div>
                  <button
                    className="mt-2 w-full bg-[#46392d]/10 text-[#46392d] px-4 py-2 rounded-md hover:bg-[#46392d]/20 transition-colors text-center font-medium"
                    style={{ textDecoration: 'none' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProductForContact({ title: product.title });
                      setShowContactModal(true);
                    }}
                  >
                    Enquire about this product
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {(selectedProduct || isCartCheckout) && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setIsCartCheckout(false);
            }}
            productTitle={isCartCheckout ? 'Cart Checkout' : selectedProduct?.title || ''}
            price={isCartCheckout ? getCartTotal() : selectedProduct?.price || 0}
            onPaymentComplete={handlePaymentComplete}
          />
        )}

        <OfferModal
          isOpen={showOfferModal}
          onClose={() => {
            setShowOfferModal(false);
            setSelectedProductForOffer(null);
          }}
          product={selectedProductForOffer}
        />

        <ContactOwnerModal
          isOpen={showContactModal}
          onClose={() => {
            setShowContactModal(false);
            setSelectedProductForContact(null);
          }}
          productTitle={selectedProductForContact?.title || ''}
        />
      </div>
    </div>
  );
};

export default Shop; 
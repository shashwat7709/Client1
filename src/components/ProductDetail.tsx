import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaRegClock, FaShippingFast, FaRegCheckCircle } from 'react-icons/fa';
import PaymentModal from './PaymentModal';
import OfferModal from './OfferModal';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addNotification } = useNotifications();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'description' | 'details' | 'shipping'>('description');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const product = products.find(p => p.id === productId);

  // Debug logging for product and images
  useEffect(() => {
    if (product) {
      console.log('Product found:', product);
      console.log('Product images:', product.images);
      console.log('Current image index:', currentImageIndex);
    }
  }, [product, currentImageIndex]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product!.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product!.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBuyNowClick = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'
      });
      addNotification(`${product.title} added to cart!`, 'success', false);
      navigate('/cart');
    }
  };

  const handleMakeOfferClick = () => {
    setIsOfferModalOpen(true);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F1EA] py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center text-[#46392d] hover:text-[#5c4b3d] mb-6"
          >
            <FaArrowLeft className="mr-2" /> Back to Shop
          </button>
          <p className="text-[#46392d]">Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EA] py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center text-[#46392d] hover:text-[#5c4b3d] mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Shop
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left Column - Image Gallery */}
            <div className="md:w-1/2 relative bg-[#F5F1EA]/30">
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-[500px] object-contain p-4"
                />
              </div>
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white shadow-md transition-all"
                  >
                    <FaChevronLeft className="text-[#46392d] w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white shadow-md transition-all"
                  >
                    <FaChevronRight className="text-[#46392d] w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-[#46392d] scale-125' : 'bg-[#46392d]/30 hover:bg-[#46392d]/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {/* Thumbnail Gallery */}
              <div className="flex gap-2 p-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 ${
                      currentImageIndex === index 
                        ? 'ring-2 ring-[#46392d] ring-offset-2' 
                        : 'hover:opacity-75'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - View ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="md:w-1/2 p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-4xl font-serif text-[#46392d] font-medium">
                    {product.title}
                  </h1>
                  <span className="px-4 py-1.5 bg-[#46392d]/10 rounded-full text-[#46392d] text-sm font-medium">
                    {product.category}
                  </span>
                </div>
                <p className="text-[#46392d]/70 text-lg">{product.subject}</p>
              </div>

              <div className="mb-8">
                <p className="text-3xl font-medium text-[#46392d]">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Quick Info */}
              {/* Removed Vintage Era and Authenticity boxes */}
              {/* <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 bg-[#F5F1EA] rounded-lg">
                  <FaRegClock className="w-6 h-6 text-[#46392d] mx-auto mb-2" />
                  <p className="text-sm text-[#46392d]">Vintage Era</p>
                </div>
                <div className="text-center p-4 bg-[#F5F1EA] rounded-lg">
                  <FaRegCheckCircle className="w-6 h-6 text-[#46392d] mx-auto mb-2" />
                  <p className="text-sm text-[#46392d]">Authenticity</p>
                  <p className="text-xs text-[#46392d]/70">Verified</p>
                </div>
              </div> */}

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex border-b border-[#46392d]/10">
                  <button
                    onClick={() => setSelectedTab('description')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      selectedTab === 'description'
                        ? 'text-[#46392d] border-b-2 border-[#46392d]'
                        : 'text-[#46392d]/60 hover:text-[#46392d]'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setSelectedTab('details')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      selectedTab === 'details'
                        ? 'text-[#46392d] border-b-2 border-[#46392d]'
                        : 'text-[#46392d]/60 hover:text-[#46392d]'
                    }`}
                  >
                    Details
                  </button>
                </div>

                <div className="py-6">
                  {selectedTab === 'description' && (
                    <div className="prose prose-stone max-w-none">
                      <p className="text-[#46392d]/80 leading-relaxed whitespace-pre-wrap">
                        {product.description}
                      </p>
                    </div>
                  )}
                  {selectedTab === 'details' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#46392d]/60">Category</p>
                          <p className="text-[#46392d] font-medium">{product.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#46392d]/60">Subject</p>
                          <p className="text-[#46392d] font-medium">{product.subject}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#46392d]/60">Condition</p>
                          <p className="text-[#46392d] font-medium">Excellent</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedTab === 'shipping' && false}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleBuyNowClick}
                  className="flex-1 bg-[#46392d] text-white px-8 py-3 rounded-lg hover:bg-[#5c4b3d] transition-colors text-lg font-medium"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    if (product) {
                      addToCart({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'
                      });
                      addNotification(`${product.title} added to cart!`, 'success', false);
                    }
                  }}
                  className="flex-1 bg-[#F5F1EA] text-[#46392d] px-8 py-3 rounded-lg hover:bg-[#46392d] hover:text-white transition-colors text-lg font-medium"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleMakeOfferClick}
                  className="w-full bg-white border-2 border-[#46392d] text-[#46392d] px-8 py-3 rounded-lg hover:bg-[#46392d] hover:text-white transition-colors text-lg font-medium"
                >
                  Make an Offer
                </button>
              </div>
              <a
                href={`mailto:info@thevintagecottage.in?subject=Enquiry about ${encodeURIComponent(product.title)}`}
                className="mt-4 w-full bg-[#46392d]/10 text-[#46392d] px-8 py-3 rounded-lg hover:bg-[#46392d]/20 transition-colors text-lg font-medium text-center block"
                style={{ textDecoration: 'none' }}
              >
                Enquire about this product
              </a>
            </div>
          </div>
        </div>

        {/* Render PaymentModal */}
        {product && (
          <PaymentModal 
            isOpen={isPaymentModalOpen} 
            onClose={() => setIsPaymentModalOpen(false)}
            productTitle={product.title}
            price={product.price}
            onPaymentComplete={() => {
              // Add your desired logic here for when payment is complete
              console.log('Payment completed!');
              // Example: navigate to a thank you page
              // navigate('/thank-you');
            }}
          />
        )}

        {/* Render OfferModal */}
        {product && (
          <OfferModal
            isOpen={isOfferModalOpen}
            onClose={() => setIsOfferModalOpen(false)}
            product={product}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 
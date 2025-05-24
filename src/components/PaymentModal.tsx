import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  price: number;
  onPaymentComplete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  productTitle,
  price,
  onPaymentComplete
}) => {
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'complete'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cod'>('qr');

  // Add state for new fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');

  // Demo QR code URL (in a real app, this would be generated dynamically)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=demo-payment-${productTitle}-${price}`;

  const handleQRPayment = () => {
    // Validate fields
    if (!name.trim() || !email.trim() || !contactNumber.trim() || !address.trim()) {
      setFormError('Please fill in all contact and delivery details.');
      return;
    }
    setFormError(''); // Clear previous errors

    setPaymentStep('processing');
    // Simulate QR code payment processing
    setTimeout(() => {
      setPaymentStep('complete');
      setTimeout(() => {
        onPaymentComplete();
        onClose();
      }, 2000);
    }, 2000);
  };

  const handleCODPayment = () => {
    // Validate fields
    if (!name.trim() || !email.trim() || !contactNumber.trim() || !address.trim()) {
      setFormError('Please fill in all contact and delivery details.');
      return;
    }
    setFormError(''); // Clear previous errors

    setPaymentStep('complete');
    setTimeout(() => {
      onPaymentComplete();
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        {paymentStep === 'details' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#46392d]">Payment Details</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-[#46392d] mb-2">{productTitle}</h3>
              {typeof price === 'number' && !isNaN(price) ? (
                <p className="text-3xl font-bold text-[#46392d]">₹{price.toFixed(2)}</p>
              ) : (
                <p className="text-xl font-bold text-red-500">Price not available</p>
              )}
            </div>

            {/* Add Form Error Display */}
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {formError}
              </div>
            )}

            {/* Add New Input Fields */}
            <div className="space-y-4 mb-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#46392d] mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#46392d] mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-[#46392d] mb-1">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  placeholder="Enter your contact number"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[#46392d] mb-1">Delivery Address</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  placeholder="Enter your delivery address"
                />
              </div>
            </div>

            <div className="space-y-8">
              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('qr')}
                  className={`py-4 px-6 rounded-lg text-lg font-medium transition-colors ${
                    paymentMethod === 'qr'
                      ? 'bg-[#46392d] text-white shadow-lg'
                      : 'bg-gray-100 text-[#46392d] hover:bg-gray-200'
                  }`}
                >
                  QR Payment
                </button>
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`py-4 px-6 rounded-lg text-lg font-medium transition-colors ${
                    paymentMethod === 'cod'
                      ? 'bg-[#46392d] text-white shadow-lg'
                      : 'bg-gray-100 text-[#46392d] hover:bg-gray-200'
                  }`}
                >
                  Cash on Delivery
                </button>
              </div>

              {paymentMethod === 'qr' ? (
                <div className="flex flex-col items-center space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-100">
                    <img
                      src={qrCodeUrl}
                      alt="Payment QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-lg text-[#46392d] text-center font-medium">
                    Scan this QR code with your mobile payment app
                  </p>
                  <button
                    onClick={handleQRPayment}
                    className="bg-[#46392d] text-white py-4 px-8 rounded-lg text-lg font-medium hover:bg-[#5c4b3d] transition-colors w-full shadow-lg"
                  >
                    Confirm Payment
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-100">
                    <p className="text-lg font-medium text-[#46392d] mb-4">
                      Cash on Delivery Details:
                    </p>
                    <ul className="list-disc list-inside text-lg text-[#46392d] space-y-3">
                      <li>Payment will be collected at the time of delivery</li>
                      <li>Please keep the exact amount ready</li>
                      <li>Delivery time: 3-5 business days</li>
                    </ul>
                  </div>
                  <button
                    onClick={handleCODPayment}
                    className="bg-[#46392d] text-white py-4 px-8 rounded-lg text-lg font-medium hover:bg-[#5c4b3d] transition-colors w-full shadow-lg"
                  >
                    Confirm Cash on Delivery
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#46392d] mx-auto mb-6"></div>
            <p className="text-2xl font-medium text-[#46392d] mb-2">Processing your payment...</p>
            <p className="text-lg text-gray-600">Please don't close this window</p>
          </div>
        )}

        {paymentStep === 'complete' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#46392d] mb-4">
              {paymentMethod === 'cod' ? 'Order Confirmed!' : 'Payment Successful!'}
            </h3>
            <p className="text-lg text-gray-600">
              {paymentMethod === 'cod' 
                ? 'Thank you for your order. Our team will contact you shortly.'
                : 'Thank you for your purchase'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal; 
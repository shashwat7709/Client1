import React, { useState, useRef, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useNotifications } from '../context/NotificationContext';

interface SellAntiquesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SellAntiquesModal: React.FC<SellAntiquesModalProps> = ({ isOpen, onClose }) => {
  const { addSubmission } = useProducts();
  const { addNotification } = useNotifications();
  const [phoneCode, setPhoneCode] = useState('+91');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setImages([]);
      setError('');
      setIsSubmitting(false);
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }, [isOpen]);

  const countryCodes = [
    // North America
    { code: '+1', country: 'USA' },
    { code: '+1', country: 'Canada' },
    
    // Europe
    { code: '+44', country: 'UK' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+31', country: 'Netherlands' },
    { code: '+46', country: 'Sweden' },
    { code: '+47', country: 'Norway' },
    { code: '+45', country: 'Denmark' },
    { code: '+358', country: 'Finland' },
    { code: '+48', country: 'Poland' },
    { code: '+43', country: 'Austria' },
    { code: '+41', country: 'Switzerland' },
    { code: '+32', country: 'Belgium' },
    { code: '+353', country: 'Ireland' },
    { code: '+351', country: 'Portugal' },
    { code: '+30', country: 'Greece' },
    
    // Asia
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+82', country: 'South Korea' },
    { code: '+65', country: 'Singapore' },
    { code: '+66', country: 'Thailand' },
    { code: '+84', country: 'Vietnam' },
    { code: '+62', country: 'Indonesia' },
    { code: '+60', country: 'Malaysia' },
    { code: '+63', country: 'Philippines' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+95', country: 'Myanmar' },
    { code: '+977', country: 'Nepal' },
    
    // Middle East
    { code: '+971', country: 'UAE' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+974', country: 'Qatar' },
    { code: '+973', country: 'Bahrain' },
    { code: '+968', country: 'Oman' },
    { code: '+965', country: 'Kuwait' },
    { code: '+962', country: 'Jordan' },
    { code: '+961', country: 'Lebanon' },
    
    // Oceania
    { code: '+61', country: 'Australia' },
    { code: '+64', country: 'New Zealand' },
    
    // Africa
    { code: '+27', country: 'South Africa' },
    { code: '+20', country: 'Egypt' },
    { code: '+234', country: 'Nigeria' },
    { code: '+254', country: 'Kenya' },
    { code: '+251', country: 'Ethiopia' },
    { code: '+212', country: 'Morocco' },
    
    // South America
    { code: '+55', country: 'Brazil' },
    { code: '+54', country: 'Argentina' },
    { code: '+56', country: 'Chile' },
    { code: '+57', country: 'Colombia' },
    { code: '+51', country: 'Peru' },
    { code: '+58', country: 'Venezuela' },
    
    // Others
    { code: '+7', country: 'Russia' },
    { code: '+380', country: 'Ukraine' },
    { code: '+90', country: 'Turkey' },
    { code: '+972', country: 'Israel' },
    { code: '+52', country: 'Mexico' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    
    if (images.length + filesArray.length > 3) {
      setError('Maximum 3 images allowed');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    filesArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload only image files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
        setError('');
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const form = e.currentTarget;
    
    // Get form data
    const title = (form.elements.namedItem('itemTitle') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
    const price = parseFloat((form.elements.namedItem('price') as HTMLInputElement).value);
    const phone = `${phoneCode}${(form.elements.namedItem('phone') as HTMLInputElement).value}`;
    const address = (form.elements.namedItem('address') as HTMLTextAreaElement).value;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;

    // Validate form
    if (!title || !description || !price || !phone || !address || !name) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image');
      setIsSubmitting(false);
      return;
    }

    // Create submission with category explicitly set to 'Antique'
    const submission = {
      title,
      description,
      price,
      category: 'Antique',
      images,
      phone,
      address,
      name,
      subject: title,
      submittedAt: new Date().toISOString()
    };

    try {
      // Add the submission
      await addSubmission(submission);
      
      // Show success notification
      addNotification('Your antique item has been submitted successfully!', 'success', false);
      
      // Reset form state
      setImages([]);
      setError('');
      setIsSubmitting(false);
      
      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit your item. Please try again.');
      setIsSubmitting(false);
      addNotification('There was an error submitting your item. Please try again.', 'error', false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#FAF6F1] p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#46392d] hover:text-[#46392d]/70"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-serif text-[#46392d] mb-6">Sell Your Antiques</h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-[#46392d] font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="itemTitle" className="block text-[#46392d] font-medium mb-2">Item Title</label>
            <input
              type="text"
              id="itemTitle"
              className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
              placeholder="Enter the title of your antique item"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-[#46392d] font-medium mb-2">Description</label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
              placeholder="Describe your item's history, condition, and unique features"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="address" className="block text-[#46392d] font-medium mb-2">Address</label>
            <textarea
              id="address"
              rows={3}
              className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
              placeholder="Enter your complete address"
              required
            ></textarea>
            <p className="text-sm text-[#46392d]/60 mt-1">This address will be used for item pickup/inspection if needed</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-[#46392d] font-medium mb-2">Contact Phone Number</label>
            <div className="flex gap-2">
              <select 
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                className="px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50 min-w-[180px]"
              >
                {countryCodes.map(({ code, country }) => (
                  <option key={`${code}-${country}`} value={code}>
                    {code} {country}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                id="phone"
                className="flex-1 px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
                placeholder="Enter your phone number"
                required
                pattern="[0-9]{10}"
              />
            </div>
            <p className="text-sm text-[#46392d]/60 mt-1">Please enter a valid phone number without spaces or special characters</p>
          </div>

          <div>
            <label htmlFor="price" className="block text-[#46392d] font-medium mb-2">Asking Price ($)</label>
            <input
              type="number"
              id="price"
              className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
              placeholder="Enter your asking price"
              required
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-[#46392d] font-medium">
                Product Images
              </label>
              <span className="text-sm text-[#46392d]/60">
                Maximum 3 images allowed ({images.length}/3)
              </span>
            </div>
            
            <div className="border-2 border-dashed border-[#46392d]/20 rounded-lg p-4 hover:border-[#46392d]/40 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                multiple
                disabled={images.length >= 3}
              />
              <div 
                onClick={() => images.length < 3 && fileInputRef.current?.click()}
                className={`cursor-pointer flex flex-col items-center justify-center py-6 ${
                  images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#46392d]/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-[#46392d]/60 text-center">
                  {images.length >= 3 ? (
                    'Maximum images reached'
                  ) : (
                    <>
                      Click to upload images<br />
                      <span className="text-xs">PNG, JPG, GIF up to 5MB</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#46392d] text-[#F5F1EA] py-3 rounded-md transition-colors duration-300 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#46392d]/90'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellAntiquesModal; 
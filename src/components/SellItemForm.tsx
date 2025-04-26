import React, { useState, useRef } from 'react';
import { useProducts } from '../context/ProductContext';
import ImageUploader from './ImageUploader';

interface SellItemFormProps {
  onSubmit: (formData: FormData) => void;
}

const SellItemForm: React.FC<SellItemFormProps> = ({ onSubmit }) => {
  const { categories } = useProducts();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'General',
    images: [] as string[],
    address: '',
    phone: '',
  });
  const [phoneCode, setPhoneCode] = useState('+91');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user makes changes
  };

  const handleImageSelect = (base64String: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, base64String]
    }));
    setError(''); // Clear error when image is selected
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Please enter your address');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('price', formData.price);
    submitFormData.append('category', formData.category);
    submitFormData.append('images', JSON.stringify(formData.images));
    submitFormData.append('address', formData.address);
    submitFormData.append('subject', formData.title);
    
    const phoneInput = e.currentTarget.elements.namedItem('phone') as HTMLInputElement;
    if (phoneInput && phoneInput.value) {
      submitFormData.append('phone', `${phoneCode}${phoneInput.value}`);
    }

    onSubmit(submitFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[#46392d] mb-1">
          Item Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] bg-white"
          placeholder="Enter the title of your antique item"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[#46392d] mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] bg-white"
          placeholder="Describe your item's history, condition, and unique features"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-[#46392d] mb-1">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] bg-white"
          placeholder="Enter your complete address"
        />
        <p className="text-sm text-[#46392d]/70 mt-1">
          This address will be used for item pickup/inspection if needed
        </p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[#46392d] mb-1">
          Contact Phone Number
        </label>
        <div className="flex gap-2">
          <select
            value={phoneCode}
            onChange={(e) => setPhoneCode(e.target.value)}
            className="px-3 py-2 rounded-md border border-[#46392d]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#46392d]/50 appearance-none cursor-pointer min-w-[180px]"
            style={{ WebkitAppearance: 'menulist' }}
          >
            {countryCodes.map(({ code, country }) => (
              <option key={code} value={code} className="py-1">
                {code} {country}
              </option>
            ))}
          </select>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            pattern="[0-9]{10}"
            className="flex-1 px-4 py-2 rounded-md border border-[#46392d]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
            placeholder="Enter your phone number"
          />
        </div>
        <p className="text-sm text-[#46392d]/70 mt-1">
          Please enter a valid phone number without spaces or special characters
        </p>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-[#46392d] mb-1">
          Asking Price ($)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] bg-white"
          placeholder="Enter your asking price"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-[#46392d] mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] bg-white"
        >
          <option value="">Select a category</option>
          {categories
            .filter(category => category !== 'All')
            .map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#46392d] mb-1">
          Item Images
        </label>
        <ImageUploader onImageSelect={handleImageSelect} />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-contain rounded-md border border-[#46392d]/20"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <p className="mt-1 text-sm text-[#46392d]/70">
          Please provide clear, well-lit photos of your item from multiple angles
        </p>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-[#46392d] text-[#F5F1EA] rounded-md hover:bg-[#46392d]/90 transition-colors duration-300 font-serif text-lg"
      >
        Submit for Review
      </button>

      <p className="text-sm text-[#46392d]/70 text-center mt-4">
        Our team will review your submission and contact you within 2-3 business days.
      </p>
    </form>
  );
};

export default SellItemForm; 
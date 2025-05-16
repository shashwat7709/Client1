import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import type { Product, AntiqueSubmission } from '../context/ProductContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationIcon from '../components/NotificationIcon';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    submissions,
    updateSubmission,
    deleteSubmission
  } = useProducts();

  // Add a refresh function
  const [refreshKey, setRefreshKey] = useState(0);
  
  const refreshProducts = () => {
    setRefreshKey(prev => prev + 1);
    console.log('Refreshing products display');
  };

  // Debug logging
  useEffect(() => {
    console.log('Products received in AdminDashboard:', products);
    console.log('Categories received:', categories);
  }, [products, categories, refreshKey]);

  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'products' | 'submissions'>('products');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState<Product>({
    id: '',
    title: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    subject: ''
  });
  const [formError, setFormError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
  const [selectedSubmissionCategory, setSelectedSubmissionCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [cardImageIndices, setCardImageIndices] = useState<{ [productId: string]: number }>({});

  // Add ref to track mounted state
  const isMounted = useRef(true);

  // Add effect to handle component mount/unmount
  useEffect(() => {
    isMounted.current = true;
    console.log('AdminDashboard mounted');
    return () => {
      isMounted.current = false;
      console.log('AdminDashboard unmounted');
    };
  }, []);

  // Add effect to handle submissions updates
  useEffect(() => {
    if (!isMounted.current) return;
    
    console.log('Submissions updated in AdminDashboard:', submissions);
    
    // Force a re-render of the submissions list
    setSelectedSubmissionCategory(prev => prev);
  }, [submissions]);

  // Move filteredProducts inside the component
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  // Consolidated filteredAndSortedSubmissions with useMemo
  const filteredAndSortedSubmissions = useMemo(() => {
    console.log('Recalculating filtered submissions with:', {
      submissions,
      selectedSubmissionCategory,
      sortBy
    });

    // Create a new array to avoid mutation
    let filtered = [...submissions];
    
    // Apply category filter
    if (selectedSubmissionCategory !== 'all') {
      filtered = filtered.filter(sub => 
        sub.category.toLowerCase() === selectedSubmissionCategory.toLowerCase()
      );
      console.log('After category filter:', filtered);
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'oldest':
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case 'highPrice':
          return b.price - a.price;
        case 'lowPrice':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    console.log('Final sorted submissions:', sorted);
    return sorted;
  }, [submissions, selectedSubmissionCategory, sortBy]);

  // Add effect to handle initial load
  useEffect(() => {
    if (!isMounted.current) return;
    
    console.log('Initial submissions load:', submissions);
    console.log('Initial filtered submissions:', filteredAndSortedSubmissions);
  }, []);

  // Add effect to handle category changes
  useEffect(() => {
    if (!isMounted.current) return;
    
    console.log('Category changed to:', selectedSubmissionCategory);
    console.log('Filtered submissions after category change:', filteredAndSortedSubmissions);
  }, [selectedSubmissionCategory, filteredAndSortedSubmissions]);

  // Add this after the filteredProducts definition
  const filteredSubmissions = selectedSubmissionCategory === 'all'
    ? submissions
    : submissions.filter(submission => submission.category === selectedSubmissionCategory);

  // Add useEffect to log submissions changes
  useEffect(() => {
    console.log('Submissions updated:', submissions);
  }, [submissions]);

  // Add debug logging for submissions
  useEffect(() => {
    console.log('Submissions in AdminDashboard:', submissions);
    console.log('Filtered submissions:', filteredAndSortedSubmissions);
  }, [submissions, filteredAndSortedSubmissions]);

  console.log('AdminDashboard - Selected category:', selectedCategory);
  console.log('AdminDashboard - Filtered products:', filteredProducts);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    console.log('AdminDashboard - Admin token:', token);
    if (!token) {
      console.log('AdminDashboard - No admin token found, redirecting to login');
      navigate('/admin/login');
    }
  }, [navigate]);

  // Reset currentImageIndex when switching tabs
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeTab]);

  const handleNewProduct = () => {
    setEditForm({
      id: 'new',
      title: '',
      description: '',
      price: 0,
      category: '',
      images: [],
      subject: ''
    });
    setIsEditing('new');
    setShowForm(true);
    setFormError('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (editForm.images.length + files.length > 3) {
      setFormError('Maximum 3 images allowed');
      return;
    }

    // Clear any existing form errors
    setFormError('');

    // Process each file
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setEditForm(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!editForm.title || !editForm.description || !editForm.price || !editForm.category || !editForm.subject) {
      setFormError('All fields are required');
      return;
    }

    if (editForm.images.length === 0) {
      setFormError('At least one image is required');
      return;
    }

    try {
      console.log('Submitting form with data:', editForm);
      if (isEditing === 'new') {
        console.log('Adding new product...');
        // Remove the id field before adding
        const { id, ...productWithoutId } = editForm;
        console.log('Product data without ID:', productWithoutId);
        addProduct(productWithoutId);
        // Add a success notification
        addNotification('Product added successfully! You can now view it in the products grid.', 'success', true);
      } else {
        console.log('Updating existing product...');
        updateProduct(editForm);
        // Add a success notification
        addNotification('Product updated successfully!', 'success', true);
      }
      setShowForm(false);
      setIsEditing(null);
      setFormError('');
      
      // Refresh products display
      refreshProducts();
      
      // Scroll to the top of the page to show the products grid
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving product:', error);
      setFormError('Failed to save product');
    }
  };

  // Add logging for products updates
  useEffect(() => {
    console.log('Products updated in AdminDashboard:', products);
  }, [products]);

  const handleEdit = (product: Product) => {
    setEditForm({
      id: product.id,
      title: product.title || '',
      description: product.description || '',
      price: Number(product.price) || 0,
      category: product.category || '',
      images: Array.isArray(product.images) ? [...product.images] : [],
      subject: product.subject || ''
    });
    setIsEditing(product.id);
    setShowForm(true);
    setFormError('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (productId: string) => {
    deleteProduct(productId);
    // Refresh products display
    refreshProducts();
  };

  // Add error recovery for edit form
  useEffect(() => {
    if (isEditing && !editForm.id) {
      // If we're editing but have no form data, try to recover
      const product = products.find(p => p.id === isEditing);
      if (product) {
        setEditForm({
          id: product.id,
          title: product.title || '',
          description: product.description || '',
          price: Number(product.price) || 0,
          category: product.category || '',
          images: Array.isArray(product.images) ? [...product.images] : [],
          subject: product.subject || ''
        });
      } else {
        // If we can't recover, reset editing state
        setIsEditing(null);
        setFormError('');
      }
    }
  }, [isEditing, editForm.id, products]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const truncateDescription = (text: string) => {
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  const toggleDescription = (productId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleDeleteSubmission = (submissionId: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      deleteSubmission(submissionId);
    }
  };

  const handleApproveSubmission = (submission: AntiqueSubmission) => {
    updateSubmission({
      ...submission,
      status: 'approved'
    });
  };

  const handleRejectSubmission = (submission: AntiqueSubmission) => {
    updateSubmission({
      ...submission,
      status: 'rejected'
    });
  };

  const handleAddToShop = (submission: AntiqueSubmission) => {
    addProduct({
      title: submission.title,
      description: submission.description,
      price: submission.price,
      category: submission.category,
      images: submission.images,
      subject: submission.subject
    });
    // Refresh products display
    refreshProducts();
  };

  // Add a function to view product details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add a function to close product details
  const handleCloseProductDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
  };

  const handlePrevCardImage = (productId: string, images: string[]) => {
    setCardImageIndices(prev => ({
      ...prev,
      [productId]: prev[productId] > 0 ? prev[productId] - 1 : images.length - 1
    }));
  };

  const handleNextCardImage = (productId: string, images: string[]) => {
    setCardImageIndices(prev => ({
      ...prev,
      [productId]: prev[productId] < images.length - 1 ? prev[productId] + 1 : 0
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA] py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-[#46392d]">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <NotificationIcon />
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#46392d] text-[#F5F1EA] rounded-md hover:bg-[#46392d]/90"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Product Details Modal */}
        {showProductDetails && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-serif text-[#46392d]">Product Details</h2>
                  <button
                    onClick={handleCloseProductDetails}
                    className="text-[#46392d] hover:text-[#5c4b3d]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Gallery */}
                  <div className="space-y-4">
                    <div className="relative h-80 bg-[#46392d]/5 rounded-lg overflow-hidden">
                      {Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0 ? (
                        <img
                          src={selectedProduct.images[currentImageIndex]}
                          alt={selectedProduct.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#46392d]/40">
                          No image available
                        </div>
                      )}
                    </div>
                    
                    {Array.isArray(selectedProduct.images) && selectedProduct.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedProduct.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                              currentImageIndex === index ? 'border-[#46392d]' : 'border-transparent'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${selectedProduct.title} - View ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-serif text-[#46392d]">{selectedProduct.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-[#46392d]/10 rounded-full text-[#46392d] text-sm font-medium">
                          {selectedProduct.category}
                        </span>
                        <span className="px-3 py-1 bg-[#46392d]/10 rounded-full text-[#46392d] text-sm font-medium">
                          {selectedProduct.subject}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-3xl font-medium text-[#46392d]">
                        ₹{selectedProduct.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-[#46392d] mb-2">Description</h4>
                      <p className="text-[#46392d]/80 whitespace-pre-wrap">{selectedProduct.description}</p>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => {
                          handleEdit(selectedProduct);
                          handleCloseProductDetails();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Product</span>
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(selectedProduct.id);
                          handleCloseProductDetails();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete Product</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'products'
                ? 'bg-[#46392d] text-[#F5F1EA]'
                : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-2 rounded-md transition-colors flex items-center ${
              activeTab === 'submissions'
                ? 'bg-[#46392d] text-[#F5F1EA]'
                : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
            }`}
          >
            Submissions
            {submissions.filter(s => s.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-sm rounded-full">
                {submissions.filter(s => s.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative max-w-4xl w-full mx-4">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add New Product Button */}
            {!showForm && (
              <button
                onClick={handleNewProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add New Product</span>
              </button>
            )}

            {/* Product Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-serif text-[#46392d] mb-4">
                  {isEditing === 'new' ? 'Add New Product' : 'Edit Product'}
                </h3>
                {formError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {formError}
                  </div>
                )}
                <div className="space-y-6">
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#46392d] mb-1">Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                          placeholder="Product Title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#46392d] mb-1">Subject</label>
                        <input
                          type="text"
                          value={editForm.subject}
                          onChange={(e) => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                          placeholder="Product Subject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#46392d] mb-1">Category</label>
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                        >
                          <option value="">Select Category</option>
                          {categories.filter(cat => cat !== 'All').map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#46392d] mb-1">Price (₹)</label>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#46392d] mb-1">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d] h-32"
                        placeholder="Product Description"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-[#46392d]">
                        Product Images
                      </label>
                      <span className="text-xs text-[#46392d]/60">
                        Maximum 3 images allowed ({editForm.images.length}/3)
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
                        disabled={editForm.images.length >= 3}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={editForm.images.length >= 3}
                        className="w-full text-center"
                      >
                        <div className="space-y-2">
                          <svg
                            className="mx-auto h-12 w-12 text-[#46392d]/40"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="text-sm text-[#46392d]/60">
                            <span className="font-medium">Click to upload</span> or drag and drop
                          </div>
                          <p className="text-xs text-[#46392d]/40">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Image Preview Grid */}
                    {editForm.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {editForm.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setEditForm(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== index)
                                }));
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setIsEditing(null);
                        setFormError('');
                      }}
                      className="px-4 py-2 border border-[#46392d] text-[#46392d] rounded-md hover:bg-[#46392d]/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#46392d]/90"
                    >
                      {isEditing === 'new' ? 'Add Product' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!showForm && (
              <>
                {/* Category Filter */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#46392d] text-[#F5F1EA]'
                          : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => {
                    const currentIndex = cardImageIndices[product.id] || 0;
                    const images = product.images || [];
                    return (
                      <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* Image Carousel */}
                        <div className="relative h-64 bg-[#46392d]/5">
                          {Array.isArray(images) && images.length > 0 ? (
                            <>
                              <img
                                src={images[currentIndex]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                                onClick={() => setSelectedImage(images[currentIndex])}
                              />
                              {images.length > 1 && (
                                <>
                                  <button
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1"
                                    onClick={() => handlePrevCardImage(product.id, images)}
                                    aria-label="Previous image"
                                  >&#8592;</button>
                                  <button
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1"
                                    onClick={() => handleNextCardImage(product.id, images)}
                                    aria-label="Next image"
                                  >&#8594;</button>
                                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {images.map((_, index) => (
                                      <button
                                        key={index}
                                        onClick={() => setCardImageIndices(prev => ({ ...prev, [product.id]: index }))}
                                        className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-[#46392d]' : 'bg-[#46392d]/30'}`}
                                        aria-label={`Go to image ${index + 1}`}
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#46392d]/40">
                              No image available
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-serif text-[#46392d] font-medium hover:text-[#5c4b3d] transition-colors">
                              {product.title}
                            </h3>
                            <span className="px-3 py-1 bg-[#46392d]/10 rounded-full text-[#46392d] text-sm font-medium">
                              {product.category}
                            </span>
                          </div>
                          
                          <div className="space-y-4">
                            {/* Description Section */}
                            <div className="prose prose-sm max-w-none">
                              <p className="text-[#46392d]/80 leading-relaxed">
                                {expandedDescriptions[product.id] 
                                  ? product.description 
                                  : truncateDescription(product.description)}
                                {product.description.length > 100 && (
                                  <button
                                    onClick={() => toggleDescription(product.id)}
                                    className="ml-2 text-[#46392d] hover:text-[#5c4b3d] font-medium text-sm"
                                  >
                                    {expandedDescriptions[product.id] ? 'Show Less' : 'Show More'}
                                  </button>
                                )}
                              </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-[#46392d]/10">
                              <div>
                                <p className="text-sm text-[#46392d]/60">Subject</p>
                                <p className="text-[#46392d] font-medium">{product.subject}</p>
                              </div>
                              <div>
                                <p className="text-sm text-[#46392d]/60">Price</p>
                                <p className="text-[#46392d] font-bold text-lg">₹{product.price.toLocaleString('en-IN')}</p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-2">
                              <button
                                onClick={() => handleViewProduct(product)}
                                className="px-4 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#46392d]/90 transition-colors duration-200 flex items-center space-x-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleEdit(product)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'submissions' && (
          <>
            {/* Add this before the submissions grid */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSubmissionCategory('all')}
                  className={`px-4 py-2 rounded-md ${
                    selectedSubmissionCategory === 'all'
                      ? 'bg-[#46392d] text-white'
                      : 'bg-white text-[#46392d] border border-[#46392d]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedSubmissionCategory('antique')}
                  className={`px-4 py-2 rounded-md ${
                    selectedSubmissionCategory === 'antique'
                      ? 'bg-[#46392d] text-white'
                      : 'bg-white text-[#46392d] border border-[#46392d]'
                  }`}
                >
                  Antiques
                </button>
                <button
                  onClick={() => setSelectedSubmissionCategory('general')}
                  className={`px-4 py-2 rounded-md ${
                    selectedSubmissionCategory === 'general'
                      ? 'bg-[#46392d] text-white'
                      : 'bg-white text-[#46392d] border border-[#46392d]'
                  }`}
                >
                  General
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#46392d]">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border rounded-md text-[#46392d]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highPrice">Highest Price</option>
                  <option value="lowPrice">Lowest Price</option>
                </select>
              </div>
            </div>

            {/* Submissions Grid */}
            <div className="grid gap-6">
              {filteredAndSortedSubmissions.map((submission) => (
                <div 
                  key={submission.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image Carousel */}
                  <div className="relative h-64 bg-[#46392d]/5">
                    {Array.isArray(submission.images) && submission.images.length > 0 ? (
                      <>
                        <img
                          src={submission.images[currentImageIndex]}
                          alt={submission.title}
                          className="w-full h-full object-cover"
                          onClick={() => setSelectedImage(submission.images[currentImageIndex])}
                        />
                        {submission.images.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {submission.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full ${
                                  currentImageIndex === index ? 'bg-[#46392d]' : 'bg-[#46392d]/30'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#46392d]/40">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-serif text-[#46392d]">{submission.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-sm rounded-full ${
                            submission.category === 'Antique' 
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {submission.category === 'Antique' 
                              ? 'Antique' : 'General'}
                          </span>
                          <span className={`px-2 py-1 text-sm rounded-full ${
                            submission.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : submission.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-[#46392d]/70">{submission.description}</p>
                        <p className="text-[#46392d] font-medium mt-2">₹{submission.price}</p>
                        <p className="text-sm text-[#46392d]/70">Category: {submission.category}</p>
                        <p className="text-sm text-[#46392d]/70">Phone: {submission.phone}</p>
                        <p className="text-sm text-[#46392d]/70">Address: {submission.address}</p>
                        <p className="text-sm text-[#46392d]/70">Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <button
                          onClick={() => handleDeleteSubmission(submission.id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Delete submission"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {submission.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveSubmission(submission)}
                              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectSubmission(submission)}
                              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-md ${
                              submission.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                            {submission.status === 'approved' && (
                              <button
                                onClick={() => handleAddToShop(submission)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                Add to Shop
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-[#46392d]/70 mb-4">{submission.description}</p>
                      <div className="space-y-2">
                        <p className="text-[#46392d]">
                          <strong>Category:</strong> {submission.category}
                        </p>
                        <p className="text-[#46392d]">
                          <strong>Asking Price:</strong> ₹{submission.price}
                        </p>
                        <p className="text-[#46392d]">
                          <strong>Phone:</strong> {submission.phone}
                        </p>
                        <p className="text-[#46392d]">
                          <strong>Address:</strong> {submission.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredAndSortedSubmissions.length === 0 && (
                <div className="text-center py-12 text-[#46392d]/70">
                  No submissions to review at this time.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
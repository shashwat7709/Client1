import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import type { Product, AntiqueSubmission } from '../context/ProductContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationIcon from '../components/NotificationIcon';
import { supabase } from '../config/supabase';
import { Dialog } from '@headlessui/react';

interface Offer {
  id: string;
  images: string[];
  content: string;
  created_at: string;
}

interface UserOffer {
  id: string;
  created_at: string;
  product_id: string;
  name: string;
  contact_number: string;
  email: string;
  offer_amount: number;
  product_price: number;
  message: string;
  image: string;
}

interface EditSubmissionForm {
  id: string;
  item_title: string;
  description: string;
  asking_price: number | '';
}

const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard component rendering...');
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct
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
  const [activeTab, setActiveTab] = useState<'products' | 'submissions' | 'newsletters' | 'userOffers'>('products');
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

  // User Offers state from Supabase
  const [userOffers, setUserOffers] = useState<UserOffer[]>([]);
  const [userOffersLoading, setUserOffersLoading] = useState(false);
  const [userOffersError, setUserOffersError] = useState<string | null>(null);

  // Fetch user offers
  useEffect(() => {
    const fetchUserOffers = async () => {
      setUserOffersLoading(true);
      setUserOffersError(null);
      console.log('Attempting to fetch user offers...');
      console.log('Current activeTab in fetch effect:', activeTab);
      const { data, error } = await supabase
        .from('user_offer')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user offers:', error);
        setUserOffersError('Failed to load user offers');
        setUserOffers([]);
      } else {
        console.log('Fetched user offers data:', data);
        setUserOffers(data || []);
      }
      setUserOffersLoading(false);
    };

    if (activeTab === 'userOffers') {
      fetchUserOffers();
    }
  }, [activeTab]);

  // Submissions state from Supabase
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setSubmissionsLoading(true);
      setSubmissionsError(null);
      const { data, error } = await supabase
        .from('antique_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setSubmissionsError('Failed to load submissions');
        setSubmissions([]);
      } else {
        setSubmissions(data || []);
      }
      setSubmissionsLoading(false);
    };
    fetchSubmissions();
  }, []);

  // Move filteredProducts inside the component
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  // Consolidated filteredAndSortedSubmissions with useMemo
  const filteredAndSortedSubmissions = useMemo(() => {
    let filtered = [...submissions];
    // Remove Apply category filter (if you want to filter by item_title or another field, adjust here)
    // if (selectedSubmissionCategory !== 'all') {
    //   filtered = filtered.filter(sub => 
    //     (sub.item_title || '').toLowerCase().includes(selectedSubmissionCategory.toLowerCase())
    //   );
    // }
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'highPrice':
          return Number(b.asking_price) - Number(a.asking_price);
        case 'lowPrice':
          return Number(a.asking_price) - Number(b.asking_price);
        default:
          return 0;
      }
    });
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

  // Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);

  // Update handleDeleteSubmission to use modal
  const handleDeleteClick = (submissionId: string) => {
    setSubmissionToDelete(submissionId);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    if (!submissionToDelete) return;
    const { error } = await supabase.from('antique_submissions').delete().eq('id', submissionToDelete);
    if (error) {
      addNotification('Failed to delete submission: ' + error.message, 'error', true);
    } else {
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionToDelete));
      addNotification('Submission deleted successfully!', 'success', true);
    }
    setShowDeleteModal(false);
    setSubmissionToDelete(null);
  };
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSubmissionToDelete(null);
  };

  const handleApproveSubmission = (submission: AntiqueSubmission) => {
    // Implement the approve submission logic here
  };

  const handleRejectSubmission = (submission: AntiqueSubmission) => {
    // Implement the reject submission logic here
  };

  const handleAddToShop = (submission: AntiqueSubmission) => {
    // Implement the add to shop logic here
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

  // Add new state for modal images and index
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);

  // State for newsletter/offer form
  const [newsletterImages, setNewsletterImages] = useState<string[]>([]);
  const [newsletterContent, setNewsletterContent] = useState('');
  const newsletterFileInputRef = useRef<HTMLInputElement>(null);
  const [newsletterFormError, setNewsletterFormError] = useState('');

  // Add state for loading and status for offers
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerStatus, setOfferStatus] = useState('');

  // Add state for offers
  const [adminOffers, setAdminOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offerEditIndex, setOfferEditIndex] = useState<number | null>(null);

  // Fetch offers from Supabase
  useEffect(() => {
    const fetchOffers = async () => {
      setOffersLoading(true);
      const { data, error } = await supabase
        .from('admin_offers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setAdminOffers(data);
      }
      setOffersLoading(false);
    };
    fetchOffers();
  }, [offerStatus]); // refetch on offer create/delete

  // Delete offer handler
  const handleDeleteOffer = async (id: string) => {
    const { error } = await supabase.from('admin_offers').delete().eq('id', id);
    if (!error) {
      setAdminOffers(prev => prev.filter(o => o.id !== id));
      setOfferStatus('Offer deleted successfully!');
    } else {
      setOfferStatus('Error deleting offer: ' + error.message);
    }
  };

  // Newsletter image upload handler
  const handleNewsletterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (newsletterImages.length + files.length > 3) {
      setNewsletterFormError('Maximum 3 images allowed');
      return;
    }
    setNewsletterFormError('');
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewsletterImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (newsletterFileInputRef.current) newsletterFileInputRef.current.value = '';
  };

  // Remove image from newsletterImages
  const handleRemoveNewsletterImage = (index: number) => {
    setNewsletterImages(prev => prev.filter((_, i) => i !== index));
  };

  // Add handler for publishing offer
  const handleOfferPublish = async () => {
    setOfferStatus('');
    if (!newsletterContent.trim() || newsletterImages.length === 0) {
      setOfferStatus('Please provide both images and content.');
      return;
    }
    setOfferLoading(true);
    if (offerEditIndex !== null && adminOffers[offerEditIndex]) {
      // Update existing offer
      const offerId = adminOffers[offerEditIndex].id;
      const { error } = await supabase
        .from('admin_offers')
        .update({ images: newsletterImages, content: newsletterContent })
        .eq('id', offerId);
      setOfferLoading(false);
      if (error) {
        setOfferStatus('Error updating offer: ' + error.message);
      } else {
        setOfferStatus('Offer updated successfully!');
        setNewsletterImages([]);
        setNewsletterContent('');
        setOfferEditIndex(null);
        if (newsletterFileInputRef.current) newsletterFileInputRef.current.value = '';
      }
    } else {
      // Insert new offer
      const { error } = await supabase
        .from('admin_offers')
        .insert([{ images: newsletterImages, content: newsletterContent }]);
      setOfferLoading(false);
      if (error) {
        setOfferStatus('Error: ' + error.message);
      } else {
        setOfferStatus('Offer published successfully!');
        setNewsletterImages([]);
        setNewsletterContent('');
        if (newsletterFileInputRef.current) newsletterFileInputRef.current.value = '';
      }
    }
  };

  // Add state for editing submissions
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editSubmissionForm, setEditSubmissionForm] = useState<EditSubmissionForm>({
    id: '',
    item_title: '',
    description: '',
    asking_price: ''
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Edit logic
  const openEditModal = (submission: any) => {
    setEditingSubmission(submission);
    setEditSubmissionForm({
      id: submission.id || '',
      item_title: submission.item_title || '',
      description: submission.description || '',
      asking_price: submission.asking_price || ''
    });
    setEditModalOpen(true);
    setEditError('');
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingSubmission(null);
    setEditSubmissionForm({
      id: '',
      item_title: '',
      description: '',
      asking_price: ''
    });
    setEditError('');
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditSubmissionForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateSubmission = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    const { id, ...updateFields } = editSubmissionForm;
    const { error } = await supabase.from('antique_submissions').update(updateFields).eq('id', id);
    setEditLoading(false);
    if (error) {
      setEditError('Failed to update submission: ' + error.message);
    } else {
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updateFields } : s)));
      addNotification('Submission updated successfully!', 'success', true);
      closeEditModal();
    }
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
          <button
            onClick={() => setActiveTab('newsletters')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'newsletters'
                ? 'bg-[#46392d] text-[#F5F1EA]'
                : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
            }`}
          >
            Offers
          </button>
          <button
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'userOffers'
                ? 'bg-[#46392d] text-[#F5F1EA]'
                : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
            }`}
            onClick={() => {
              setActiveTab('userOffers');
              console.log('Active tab set to:', 'userOffers');
            }}
          >
            User Offers
          </button>
        </div>

        {/* Image Modal */}
        {selectedImage && modalImages.length > 0 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={modalImages[modalImageIndex]}
                alt="Selected"
                className="w-full h-auto rounded-lg object-contain max-h-[80vh]"
              />
              {/* Left arrow */}
              {modalImages.length > 1 && (
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white rounded-full p-2 z-20 hover:bg-opacity-90"
                  onClick={() => {
                    setModalImageIndex((prev) => prev === 0 ? modalImages.length - 1 : prev - 1);
                    setSelectedImage(modalImages[modalImageIndex === 0 ? modalImages.length - 1 : modalImageIndex - 1]);
                  }}
                >&#8592;</button>
              )}
              {/* Right arrow */}
              {modalImages.length > 1 && (
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white rounded-full p-2 z-20 hover:bg-opacity-90"
                  onClick={() => {
                    setModalImageIndex((prev) => prev === modalImages.length - 1 ? 0 : prev + 1);
                    setSelectedImage(modalImages[modalImageIndex === modalImages.length - 1 ? 0 : modalImageIndex + 1]);
                  }}
                >&#8594;</button>
              )}
              {/* Dots */}
              {modalImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                  {modalImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setModalImageIndex(idx);
                        setSelectedImage(modalImages[idx]);
                      }}
                      className={`w-3 h-3 rounded-full ${modalImageIndex === idx ? 'bg-white' : 'bg-white/50'}`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-30 text-white bg-black bg-opacity-70 rounded-full p-2 hover:bg-opacity-90"
                style={{ zIndex: 30 }}
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
                  {filteredProducts
                    .filter(product => product !== null && product !== undefined)
                    .map((product) => {
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
                                onClick={() => {
                                  setModalImages(images);
                                  setModalImageIndex(currentIndex);
                                  setSelectedImage(images[currentIndex]);
                                }}
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

            {/* Error message if fetch failed */}
            {submissionsError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {submissionsError}
              </div>
            )}

            {/* Submissions Grid */}
            <div className="grid gap-6">
              {filteredAndSortedSubmissions.map((submission) => (
                <div 
                  key={submission.id}
                  className="bg-white rounded-xl shadow border border-[#e2d6c2] max-w-md mx-auto flex flex-col md:flex-row md:max-w-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0 bg-[#46392d]/5">
                    {Array.isArray(submission.images) && submission.images.length > 0 ? (
                        <img
                        src={submission.images[0]}
                        alt={submission.item_title}
                        className="w-full h-full object-cover cursor-pointer rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                          onClick={() => {
                            setModalImages(submission.images);
                          setModalImageIndex(0);
                          setSelectedImage(submission.images[0]);
                          }}
                        />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#46392d]/40 text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between p-4 md:p-5">
                      <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-serif text-[#46392d] font-medium truncate max-w-[180px]">{submission.item_title}</h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">Submission</span>
                        </div>
                      <p className="text-xs text-[#46392d]/70 mb-1 truncate max-w-[220px]">{submission.description}</p>
                      <p className="text-base text-[#46392d] font-semibold mb-1">₹{submission.asking_price}</p>
                      <p className="text-xs text-[#46392d]/70 mb-0.5">Name: {submission.name}</p>
                      <p className="text-xs text-[#46392d]/70 mb-0.5">Phone: {submission.phone_country_code} {submission.phone_number}</p>
                      <p className="text-xs text-[#46392d]/70 mb-0.5">Address: {submission.address}</p>
                      <p className="text-xs text-[#46392d]/40">Submitted: {new Date(submission.created_at).toLocaleDateString()}</p>
                      </div>
                    <div className="flex items-center gap-2 justify-end mt-2">
                        <button
                        onClick={() => handleDeleteClick(submission.id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Delete submission"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredAndSortedSubmissions.length === 0 && !submissionsError && (
                <div className="text-center py-12 text-[#46392d]/70">
                  No submissions to review at this time.
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'newsletters' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-serif text-[#46392d] mb-4">Create Offer</h3>
              {newsletterFormError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {newsletterFormError}
                </div>
              )}
              {offerStatus && (
                <div className={`mb-4 px-4 py-3 rounded ${offerStatus.startsWith('Error') ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>{offerStatus}</div>
              )}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#46392d] mb-1">Images</label>
                  <input
                    ref={newsletterFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleNewsletterImageUpload}
                    className="hidden"
                    multiple
                    disabled={newsletterImages.length >= 3}
                  />
                  <button
                    type="button"
                    onClick={() => newsletterFileInputRef.current?.click()}
                    disabled={newsletterImages.length >= 3}
                    className="w-full text-center border border-[#46392d]/20 rounded-md py-2 mb-2"
                  >
                    Upload Images (max 3)
                  </button>
                  {newsletterImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {newsletterImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Offer Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewsletterImage(index)}
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
                <div>
                  <label className="block text-sm font-medium text-[#46392d] mb-1">Content</label>
                  <textarea
                    value={newsletterContent}
                    onChange={e => setNewsletterContent(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d] h-32"
                    placeholder="Write your offer content here..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#46392d]/90"
                    onClick={handleOfferPublish}
                    disabled={offerLoading}
                  >
                    {offerLoading ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>

            {/* Below Create Offer form, list all offers */}
            {offersLoading ? (
              <div className="text-center text-[#46392d]/60 py-8">Loading offers...</div>
            ) : adminOffers.length === 0 ? (
              <div className="text-center text-[#46392d]/60 py-8">No offers yet.</div>
            ) : (
              <div className="space-y-6 max-w-2xl mx-auto">
                {adminOffers.map((offer, idx) => (
                  <div key={offer.id} className="bg-white rounded-lg shadow p-4 border border-[#46392d]/10">
                    <div className="flex flex-wrap gap-4 mb-2">
                      {offer.images && offer.images.length > 0 && offer.images.map((img, i) => (
                        <img key={i} src={img} alt={`Offer ${idx + 1} Image ${i + 1}`} className="w-24 h-24 object-cover rounded border border-[#46392d]/20" />
                      ))}
                    </div>
                    <div className="text-[#46392d] mb-2 whitespace-pre-line">{offer.content}</div>
                    <div className="text-xs text-[#46392d]/50 mb-2">{new Date(offer.created_at).toLocaleString()}</div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        onClick={() => {
                          setNewsletterImages(offer.images);
                          setNewsletterContent(offer.content);
                          setOfferEditIndex(idx);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >Edit</button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        onClick={() => handleDeleteOffer(offer.id)}
                      >Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New section for User Offers */}
        {activeTab === 'userOffers' && (
          <div>
            <h2 className="text-2xl font-serif text-[#46392d] mb-4">User Offers</h2>
            {userOffersLoading && <p>Loading user offers...</p>}
            {userOffersError && <p className="text-red-500">{userOffersError}</p>}
            {!userOffersLoading && !userOffersError && userOffers.length === 0 && (
              <p>No user offers found.</p>
            )}
            {!userOffersLoading && !userOffersError && userOffers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userOffers.map((offer) => (
                  <div key={offer.id} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-xl font-serif text-[#46392d]">Offer Details</h3>
                    {offer.image && (
                      <div className="mb-4">
                        <img src={offer.image} alt="Product" className="w-full h-48 object-cover rounded-md" />
                      </div>
                    )}
                    <p><strong>Name:</strong> {offer.name}</p>
                    <p><strong>Contact Number:</strong> {offer.contact_number}</p>
                    <p><strong>Email:</strong> {offer.email}</p>
                    <p><strong>Offer Amount:</strong> ₹{offer.offer_amount}</p>
                    <p><strong>Product Price:</strong> ₹{offer.product_price}</p>
                    <p><strong>Message:</strong> {offer.message}</p>
                    <p className="text-sm text-gray-500">Submitted on: {new Date(offer.created_at).toLocaleString()}</p>
                    {/* Add more offer details as needed */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Submission Modal */}
      {editModalOpen && (
        <Dialog open={editModalOpen} onClose={closeEditModal} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30 z-40" />
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 z-50 relative">
              <Dialog.Title className="text-xl font-serif text-[#46392d] mb-4">Edit Submission</Dialog.Title>
              {editError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">{editError}</div>}
              <form onSubmit={handleUpdateSubmission} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#46392d] mb-1">Title</label>
                  <input
                    type="text"
                    name="item_title"
                    value={editSubmissionForm.item_title || ''}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#46392d] mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editSubmissionForm.description || ''}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#46392d] mb-1">Asking Price</label>
                  <input
                    type="number"
                    name="asking_price"
                    value={editSubmissionForm.asking_price || ''}
                    onChange={handleEditFormChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={closeEditModal} className="px-4 py-2 border border-[#46392d] text-[#46392d] rounded-md hover:bg-[#46392d]/10">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#46392d]/90" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full relative">
            <h3 className="text-xl font-serif text-[#46392d] mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-[#46392d]">Are you sure you want to delete this submission? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-[#46392d] text-[#46392d] rounded-md hover:bg-[#46392d]/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNotifications } from './NotificationContext';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  subject: string;
}

export interface AntiqueSubmission {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  subject: string;
  userId?: string;
}

interface Offer {
  id: string;
  productId: string;
  amount: number;
  message: string;
  name: string;
  contactNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  userId?: string;
}

interface OfferDiscount {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: string[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  submissions: AntiqueSubmission[];
  addSubmission: (submission: Omit<AntiqueSubmission, 'id' | 'status' | 'submittedAt'>) => void;
  updateSubmission: (submission: AntiqueSubmission) => void;
  deleteSubmission: (submissionId: string) => void;
  offers: Offer[];
  addOffer: (offer: { 
    productId: string; 
    amount: number; 
    message: string;
    name: string;
    contactNumber: string;
  }) => void;
  updateOffer: (offer: Offer) => void;
  deleteOffer: (offerId: string) => void;
  offersAndDiscounts: OfferDiscount[];
  addOfferDiscount: (offer: Omit<OfferDiscount, 'id' | 'createdAt' | 'status'>) => void;
  updateOfferDiscount: (offer: OfferDiscount) => void;
  deleteOfferDiscount: (id: string) => void;
}

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

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification } = useNotifications();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from MongoDB on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        addNotification('Failed to load products', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [addNotification]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error('Failed to add product');
      
      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
      addNotification('Product added successfully!', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      addNotification('Failed to add product', 'error');
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error('Failed to update product');
      
      const updatedProduct = await response.json();
      setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
      addNotification('Product updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating product:', error);
      addNotification('Failed to update product', 'error');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      setProducts(prev => prev.filter(p => p.id !== productId));
      addNotification('Product deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      addNotification('Failed to delete product', 'error');
    }
  };

  // Add a ref to track if we're in the middle of an update
  const isUpdating = useRef(false);

  // Add a queue for pending updates
  const updateQueue = useRef<(() => void)[]>([]);

  // Process the update queue
  const processUpdateQueue = useCallback(() => {
    if (!isUpdating.current && updateQueue.current.length > 0) {
      isUpdating.current = true;
      const update = updateQueue.current.shift();
      if (update) {
        update();
      }
      isUpdating.current = false;
      if (updateQueue.current.length > 0) {
        setTimeout(processUpdateQueue, 0);
      }
    }
  }, []);

  // Add image compression function
  const compressImage = useCallback((base64String: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with 0.7 quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        // If compression fails, return original
        resolve(base64String);
      };
    });
  }, []);

  // Enhanced compression function
  const compressSubmissions = useCallback(async (submissions: AntiqueSubmission[]) => {
    const compressedSubmissions = await Promise.all(submissions.map(async submission => {
      // Compress images
      const compressedImages = await Promise.all(
        submission.images.map(img => compressImage(img))
      );

      return {
        ...submission,
        images: compressedImages,
        description: submission.description.substring(0, 500), // Limit description length
        // Remove any unnecessary metadata
        metadata: undefined
      };
    }));

    return compressedSubmissions;
  }, [compressImage]);

  // Enhanced cleanup function
  const cleanupOldSubmissions = useCallback((submissions: AntiqueSubmission[]) => {
    const now = new Date().getTime();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
    
    // First, remove old submissions
    let cleanedSubmissions = submissions.filter(submission => {
      const submissionDate = new Date(submission.submittedAt).getTime();
      return submissionDate > thirtyDaysAgo;
    });

    // If still too many, remove rejected submissions
    if (cleanedSubmissions.length > 100) {
      cleanedSubmissions = cleanedSubmissions.filter(sub => sub.status !== 'rejected');
    }

    // If still too many, keep only approved and pending
    if (cleanedSubmissions.length > 100) {
      cleanedSubmissions = cleanedSubmissions.filter(sub => 
        sub.status === 'approved' || sub.status === 'pending'
      );
    }

    // If still too many, keep only the most recent
    if (cleanedSubmissions.length > 100) {
      cleanedSubmissions = cleanedSubmissions
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .slice(0, 100);
    }

    return cleanedSubmissions;
  }, []);

  // Enhanced quota exceeded handler
  const handleQuotaExceeded = useCallback(async (submissions: AntiqueSubmission[]) => {
    console.log('LocalStorage quota exceeded, attempting cleanup and compression');
    
    try {
      // First try to clean up old submissions
      const cleanedSubmissions = cleanupOldSubmissions(submissions);
      
      if (cleanedSubmissions.length < submissions.length) {
        console.log('Cleaned up old submissions, trying to save again');
        try {
          localStorage.setItem('antiqueSubmissions', JSON.stringify(cleanedSubmissions));
          return cleanedSubmissions;
        } catch (error) {
          console.error('Still unable to save after cleanup:', error);
        }
      }
      
      // If still too large, try compressing
      console.log('Trying to compress submissions');
      const compressedSubmissions = await compressSubmissions(cleanedSubmissions);
      
      try {
        localStorage.setItem('antiqueSubmissions', JSON.stringify(compressedSubmissions));
        return compressedSubmissions;
      } catch (error) {
        console.error('Unable to save even after compression:', error);
        // If all else fails, keep only the most recent 50 submissions
        const recentSubmissions = cleanedSubmissions
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
          .slice(0, 50);
        
        try {
          localStorage.setItem('antiqueSubmissions', JSON.stringify(recentSubmissions));
          return recentSubmissions;
        } catch (error) {
          console.error('Unable to save even after limiting count:', error);
          return [];
        }
      }
    } catch (error) {
      console.error('Error in handleQuotaExceeded:', error);
      return [];
    }
  }, [cleanupOldSubmissions, compressSubmissions]);

  // Improve submissions state with proper initialization
  const [submissions, setSubmissions] = useState<AntiqueSubmission[]>(() => {
    try {
    const savedSubmissions = localStorage.getItem('antiqueSubmissions');
      if (savedSubmissions) {
        const parsed = JSON.parse(savedSubmissions);
        console.log('Initial submissions loaded:', parsed);
        return parsed;
      }
      console.log('No initial submissions found');
      return [];
    } catch (error) {
      console.error('Error loading initial submissions:', error);
      return [];
    }
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const savedOffers = localStorage.getItem('productOffers');
    return savedOffers ? JSON.parse(savedOffers) : [];
  });

  const [offersAndDiscounts, setOffersAndDiscounts] = useState<OfferDiscount[]>(() => {
    const savedOffers = localStorage.getItem('offersAndDiscounts');
    return savedOffers ? JSON.parse(savedOffers) : [];
  });

  // Save products to localStorage whenever they change
  useEffect(() => {
    try {
    localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }, [products]);

  // Add effect to handle storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'antiqueSubmissions' && e.newValue) {
        try {
          const newSubmissions = JSON.parse(e.newValue);
          console.log('Storage event triggered, updating submissions:', newSubmissions);
          setSubmissions(newSubmissions);
        } catch (error) {
          console.error('Error parsing submissions from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add effect to persist state changes
  useEffect(() => {
    const saveSubmissions = async () => {
      try {
    localStorage.setItem('antiqueSubmissions', JSON.stringify(submissions));
        console.log('Persisted submissions state:', submissions);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.log('Quota exceeded in effect, attempting to handle...');
          const handledSubmissions = await handleQuotaExceeded(submissions);
          setSubmissions(handledSubmissions);
        } else {
          console.error('Error persisting submissions state:', error);
        }
      }
    };

    saveSubmissions();
  }, [submissions, handleQuotaExceeded]);

  // Save offers to localStorage whenever they change
  useEffect(() => {
    try {
    localStorage.setItem('productOffers', JSON.stringify(offers));
    } catch (error) {
      console.error('Error saving offers to localStorage:', error);
    }
  }, [offers]);

  // Save offers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('offersAndDiscounts', JSON.stringify(offersAndDiscounts));
  }, [offersAndDiscounts]);

  // Update addSubmission to handle image compression
  const addSubmission = useCallback(async (submission: Omit<AntiqueSubmission, 'id' | 'status' | 'submittedAt'>) => {
    try {
      // Compress images before creating submission
      const compressedImages = await Promise.all(
        submission.images.map(img => compressImage(img))
      );

    const newSubmission: AntiqueSubmission = {
      ...submission,
        images: compressedImages,
      id: String(Date.now()),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

      console.log('Queueing new submission:', newSubmission);

      const update = () => {
        setSubmissions(prev => {
          const updatedSubmissions = [...prev, newSubmission];
          console.log('Processing submission update:', updatedSubmissions);
          
          try {
            localStorage.setItem('antiqueSubmissions', JSON.stringify(updatedSubmissions));
            console.log('Saved submissions to localStorage');
            return updatedSubmissions;
          } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
              console.log('Quota exceeded, attempting to handle...');
              // Handle quota exceeded in a separate async operation
              (async () => {
                try {
                  const handledSubmissions = await handleQuotaExceeded(prev);
                  if (handledSubmissions.length > 0) {
                    // Add the new submission to the handled submissions
                    const finalSubmissions = [...handledSubmissions, newSubmission];
                    try {
                      localStorage.setItem('antiqueSubmissions', JSON.stringify(finalSubmissions));
                      setSubmissions(finalSubmissions);
                    } catch (error) {
                      console.error('Error saving final submissions:', error);
                      setSubmissions(prev);
                    }
                  } else {
                    setSubmissions(prev);
                  }
                } catch (error) {
                  console.error('Error handling quota exceeded:', error);
                  setSubmissions(prev);
                }
              })();
            } else {
              console.error('Error saving to localStorage:', error);
            }
            return prev; // Return previous state while handling error
          }
        });
      };

      updateQueue.current.push(update);
      processUpdateQueue();
    } catch (error) {
      console.error('Error in addSubmission:', error);
      throw error;
    }
  }, [processUpdateQueue, handleQuotaExceeded, compressImage]);

  const updateSubmission = useCallback((submission: AntiqueSubmission) => {
    console.log('Queueing submission update:', submission);

    const update = () => {
      setSubmissions(prev => {
        const updatedSubmissions = prev.map(s => {
          if (s.id === submission.id) {
            // Find the previous submission to check if status changed
            const previousSubmission = prev.find(ps => ps.id === submission.id);
            if (previousSubmission && previousSubmission.status !== submission.status) {
              // Status has changed, trigger notifications
              let message = `Your submission "${submission.title}" has been ${submission.status}.`;
              
              // Add pricing feedback for rejected submissions
              if (submission.status === 'rejected') {
                message += ' Our team suggests reviewing similar items in our shop for pricing guidance.';
              }
              
              // Add next steps for approved submissions
              if (submission.status === 'approved') {
                message += ' Our team will contact you shortly to arrange collection.';
              }
              
              // Add notification using the main notification system
              addNotification(message, submission.status === 'approved' ? 'success' : 'info', false);

              // Trigger browser notification if supported
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Submission Update', {
                  body: message,
                  icon: '/logo.png'
                });
              }
            }
            return submission;
          }
          return s;
        });
        
        console.log('Processing submission update:', updatedSubmissions);
        
        try {
          localStorage.setItem('antiqueSubmissions', JSON.stringify(updatedSubmissions));
          console.log('Saved updated submissions to localStorage');
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        
        return updatedSubmissions;
      });
    };

    updateQueue.current.push(update);
    processUpdateQueue();
  }, [processUpdateQueue, addNotification]);

  const deleteSubmission = useCallback((submissionId: string) => {
    console.log('Queueing submission deletion:', submissionId);

    const update = () => {
      setSubmissions(prev => {
        const updatedSubmissions = prev.filter(s => s.id !== submissionId);
        console.log('Processing submission deletion:', updatedSubmissions);
        
        try {
          localStorage.setItem('antiqueSubmissions', JSON.stringify(updatedSubmissions));
          console.log('Saved updated submissions to localStorage');
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        
        return updatedSubmissions;
      });
    };

    updateQueue.current.push(update);
    processUpdateQueue();
  }, [processUpdateQueue]);

  const addOffer = (offer: { 
    productId: string; 
    amount: number; 
    message: string;
    name: string;
    contactNumber: string;
  }) => {
    const newOffer: Offer = {
      ...offer,
      id: String(Date.now()),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setOffers(prev => [...prev, newOffer]);
  };

  const updateOffer = useCallback((offer: Offer) => {
    setOffers(prev => {
      const updatedOffers = prev.map(o => {
        if (o.id === offer.id) {
          // Find the previous offer to check if status changed
          const previousOffer = prev.find(po => po.id === offer.id);
          if (previousOffer && previousOffer.status !== offer.status) {
            // Status has changed, trigger notifications
            const product = products.find(p => p.id === offer.productId);
            
            if (product) {
              let message = `Your offer for "${product.title}" has been ${offer.status}.`;

              // Add next steps for approved offers
              if (offer.status === 'approved') {
                message += ' Please proceed with the payment within 24 hours to secure your purchase.';
              }

              // Add alternative suggestions for rejected offers
              if (offer.status === 'rejected') {
                message += ' Feel free to browse similar items or submit a new offer.';
              }

              // Add notification using the main notification system
              addNotification(
                message,
                offer.status === 'approved' ? 'success' : 'error',
                false
              );

              // Trigger browser notification if supported
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Offer Update', {
                  body: message,
                  icon: '/logo.png'
                });
              }
            }
          }
          return offer;
        }
        return o;
      });

      try {
        localStorage.setItem('productOffers', JSON.stringify(updatedOffers));
      } catch (error) {
        console.error('Error saving offers to localStorage:', error);
      }

      return updatedOffers;
    });
  }, [products, addNotification]);

  const deleteOffer = (offerId: string) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
  };

  const addOfferDiscount = useCallback((offer: Omit<OfferDiscount, 'id' | 'createdAt' | 'status'>) => {
    const newOffer: OfferDiscount = {
      ...offer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setOffersAndDiscounts(prev => [newOffer, ...prev]);
  }, []);

  const updateOfferDiscount = useCallback((offer: OfferDiscount) => {
    setOffersAndDiscounts(prev =>
      prev.map(o => o.id === offer.id ? offer : o)
    );
  }, []);

  const deleteOfferDiscount = useCallback((id: string) => {
    setOffersAndDiscounts(prev => prev.filter(o => o.id !== id));
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      setProducts,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      submissions,
      addSubmission,
      updateSubmission,
      deleteSubmission,
      offers,
      addOffer,
      updateOffer,
      deleteOffer,
      offersAndDiscounts,
      addOfferDiscount,
      updateOfferDiscount,
      deleteOfferDiscount,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// Initial products data
const initialProducts: Product[] = [
  // Vintage Furniture Category
  {
    id: '1',
    title: 'Antique Display Cabinet',
    description: 'Elegant glass-front display cabinet, perfect for showcasing your treasured collections.',
    price: 1200,
    category: 'Vintage Furniture',
    images: ['/photos/products/2024-08-02.jpg'],
    subject: 'Furniture'
  },
  {
    id: '2',
    title: 'Victorian Armchair',
    description: 'Beautifully preserved Victorian-era armchair with original upholstery.',
    price: 850,
    category: 'Vintage Furniture',
    images: ['/photos/products/2024-08-02 (1).jpg'],
    subject: 'Furniture'
  },
  // Crystal & Glass Category
  {
    id: '3',
    title: 'Crystal Chandelier',
    description: 'Stunning vintage crystal chandelier with intricate detailing.',
    price: 1500,
    category: 'Crystal & Glass',
    images: ['/photos/products/2024-08-02 (2).jpg'],
    subject: 'Lighting'
  },
  // Decorative Accents Category
  {
    id: '4',
    title: 'Brass Wall Clock',
    description: 'Antique brass wall clock with Roman numerals, fully functional.',
    price: 300,
    category: 'Decorative Accents',
    images: ['/photos/products/2024-08-02 (3).jpg'],
    subject: 'Clock'
  },
  // Lighting & Mirrors Category
  {
    id: '5',
    title: 'Ornate Gold Mirror',
    description: 'Large ornate gold-framed mirror with baroque-style details.',
    price: 950,
    category: 'Lighting & Mirrors',
    images: ['/photos/products/2024-08-02 (4).jpg'],
    subject: 'Mirror'
  },
  // Tableware Category
  {
    id: '6',
    title: 'Fine China Tea Set',
    description: 'Complete vintage fine china tea set with floral pattern.',
    price: 400,
    category: 'Tableware',
    images: ['/photos/products/2024-08-02 (5).jpg'],
    subject: 'Tea Set'
  }
]; 
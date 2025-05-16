import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { supabase } from '../config/supabase';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  subject: string;
  created_at?: string;
  updated_at?: string;
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
  created_at?: string;
  updated_at?: string;
}

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: string[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  submissions: AntiqueSubmission[];
  addSubmission: (submission: Omit<AntiqueSubmission, 'id' | 'status' | 'submittedAt'>) => Promise<void>;
  updateSubmission: (submission: AntiqueSubmission) => Promise<void>;
  deleteSubmission: (submissionId: string) => Promise<void>;
  isLoading: boolean;
  loadError: string | null;
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
  const [submissions, setSubmissions] = useState<AntiqueSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        
        // Load submissions
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (submissionsError) throw submissionsError;

        // Normalize images field for products
        const normalizedProducts = (productsData || []).map((product: any) => ({
          ...product,
          images: Array.isArray(product.images)
            ? product.images
            : typeof product.images === 'string'
              ? (() => { try { const arr = JSON.parse(product.images); return Array.isArray(arr) ? arr : []; } catch { return []; } })()
              : [],
        }));
        // Normalize images field for submissions
        const normalizedSubmissions = (submissionsData || []).map((submission: any) => ({
          ...submission,
          images: Array.isArray(submission.images)
            ? submission.images
            : typeof submission.images === 'string'
              ? (() => { try { const arr = JSON.parse(submission.images); return Array.isArray(arr) ? arr : []; } catch { return []; } })()
              : [],
        }));

        setProducts(normalizedProducts);
        setSubmissions(normalizedSubmissions);
        setLoadError(null);
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        setLoadError('Failed to load data. Please refresh the page.');
        addNotification('Failed to load data. Please refresh the page.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [addNotification]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      // Insert the product with all images in the images array
      const { data, error } = await supabase
        .from('products')
        .insert([{
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          subject: product.subject,
          images: product.images // Store all images in the images array
        }])
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [...prev, data]);
      addNotification('Product added successfully!', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      addNotification('Failed to add product', 'error');
      throw error; // Re-throw to handle in the component
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', product.id);

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      addNotification('Product updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating product:', error);
      addNotification('Failed to update product', 'error');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));
      addNotification('Product deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      addNotification('Failed to delete product', 'error');
    }
  };

  const addSubmission = async (submission: Omit<AntiqueSubmission, 'id' | 'status' | 'submittedAt'>) => {
    try {
      const newSubmission = {
        ...submission,
        status: 'pending' as const,
        submittedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('submissions')
        .insert([newSubmission])
        .select()
        .single();

      if (error) throw error;

      setSubmissions(prev => [...prev, data]);
      addNotification('Submission added successfully!', 'success');
    } catch (error) {
      console.error('Error adding submission:', error);
      addNotification('Failed to add submission', 'error');
    }
  };

  const updateSubmission = async (submission: AntiqueSubmission) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update(submission)
        .eq('id', submission.id);

      if (error) throw error;

      setSubmissions(prev => prev.map(s => s.id === submission.id ? submission : s));
      addNotification('Submission updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating submission:', error);
      addNotification('Failed to update submission', 'error');
    }
  };

  const deleteSubmission = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;

      setSubmissions(prev => prev.filter(s => s.id !== submissionId));
      addNotification('Submission deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting submission:', error);
      addNotification('Failed to delete submission', 'error');
    }
  };

  const value = {
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
    isLoading,
    loadError
  };

  return (
    <ProductContext.Provider value={value}>
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

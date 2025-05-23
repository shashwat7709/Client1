import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase'; // Import the Supabase client

interface CartItem {
  id: string; // This will be the product_id from your products data
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: { id: string; title: string; price: number; image: string }) => Promise<void>; // Modified to be async
  removeFromCart: (id: string) => Promise<void>; // Modified to be async
  updateQuantity: (id: string, quantity: number) => Promise<void>; // Modified to be async
  clearCart: () => Promise<void>; // Modified to be async
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Function to get or create a unique session ID
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('cartSessionId');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('cartSessionId', sessionId);
  }
  return sessionId;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const sessionId = getSessionId();

  // Function to fetch cart items from Supabase
  const fetchCartItems = async () => {
    console.log('Fetching cart items...');
    const { data, error } = await supabase
      .from('cart_items')
      .select('product_id, quantity')
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error fetching cart items:', error);
      // Optionally add a user-facing notification here
      return;
    }

    // We need to join with product data to get title, price, and image
    // For now, let's just set the state with product_id and quantity
    // A more robust solution would fetch product details or store them in the cart_items table
    const productIds = data.map(item => item.product_id);
    const { data: productData, error: productError } = await supabase
      .from('products') // Assuming you have a 'products' table
      .select('id, title, price, images')
      .in('id', productIds);
      
    if (productError) {
      console.error('Error fetching product details for cart items:', productError);
      // Optionally add a user-facing notification here
      return;
    }

    const mergedCart: CartItem[] = data.map(cartItem => {
      const product = productData.find(p => p.id === cartItem.product_id);
      return {
        id: cartItem.product_id,
        title: product?.title || 'Unknown Product',
        price: product?.price || 0,
        image: (product?.images && product?.images.length > 0) ? product.images[0] : '/placeholder.svg',
        quantity: cartItem.quantity,
      };
    });

    console.log('Fetched and merged cart data:', mergedCart);
    setCart(mergedCart);
  };

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const addToCart = async (item: { id: string; title: string; price: number; image: string }) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('session_id', sessionId)
      .eq('product_id', item.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (item not in cart)
      console.error('Error checking if item exists in cart:', error);
      // Optionally add a user-facing notification here
      return;
    }

    if (data) {
      // Item exists, update quantity
      const newQuantity = data.quantity + 1;
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('session_id', sessionId)
        .eq('product_id', item.id);

      if (updateError) {
        console.error('Error updating item quantity in cart:', updateError);
        // Optionally add a user-facing notification here
        return;
      }
    } else {
      // Item does not exist, insert new row
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          product_id: item.id,
          quantity: 1,
          session_id: sessionId,
          // created_at will be automatically set by Supabase if configured
        });

      if (insertError) {
        console.error('Error adding new item to cart:', insertError);
        // Optionally add a user-facing notification here
        return;
      }
    }

    // After adding/updating, re-fetch the cart to update the UI
    fetchCartItems();
  };

  const removeFromCart = async (id: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId)
      .eq('product_id', id);

    if (error) {
      console.error('Error removing item from cart:', error);
      // Optionally add a user-facing notification here
      return;
    }

    // After removing, re-fetch the cart to update the UI
    fetchCartItems();
  };

  const updateQuantity = async (id: string, quantity: number) => {
    console.log(`Attempting to update quantity for item ${id} to ${quantity}`);
    if (quantity < 1) {
      // If quantity is less than 1, remove the item
      await removeFromCart(id);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('session_id', sessionId)
      .eq('product_id', id);

    if (error) {
      console.error('Supabase updateQuantity error:', error);
    } else {
      console.log('Supabase updateQuantity successful');
    }

    if (error) {
      console.error('Error updating item quantity in cart:', error);
      // Optionally add a user-facing notification here
      return;
    }

    // After updating, re-fetch the cart to update the UI
    fetchCartItems();
  };

  const clearCart = async () => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error clearing cart:', error);
      // Optionally add a user-facing notification here
      return;
    }

    // After clearing, re-fetch the cart (which will be empty) to update the UI
    fetchCartItems();
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
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
    console.log('Attempting to fetch cart items from Supabase for session:', sessionId);
    const { data, error } = await supabase
      .from('cart_items')
      .select<string, { product_id: string; quantity: number }>( 'product_id, quantity')
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error fetching cart items:', error);
      // Optionally add a user-facing notification here
      setCart([]); // Clear cart on fetch error to avoid displaying stale data
      return;
    }

    console.log('Successfully fetched cart items raw data:', data); // Log fetched data

    // We need to join with product data to get title, price, and image
    // For now, let's just set the state with product_id and quantity
    // A more robust solution would fetch product details or store them in the cart_items table
    const productIds = data?.map(item => item.product_id) || [];
    if (productIds.length === 0) {
        console.log('No cart items with product_ids found, setting cart to empty.');
        setCart([]);
        return;
    }

    console.log('Fetching product details for product IDs:', productIds); // Log product ID fetch initiation

    const { data: productData, error: productError } = await supabase
      .from('products') // Assuming you have a 'products' table
      .select('id, title, price, images')
      .in('id', productIds);
      
    if (productError) {
      console.error('Error fetching product details for cart items:', productError);
      // Optionally add a user-facing notification here
      return;
    }

    console.log('Successfully fetched product data:', productData); // Log fetched product data

    const mergedCart: CartItem[] = (data || []).map(cartItem => {
      console.log('Mapping cart item:', cartItem); // Log each item being mapped
      const product = (productData || []).find(p => p.id === cartItem.product_id);
      return {
        id: cartItem.product_id,
        title: product?.title || 'Unknown Product',
        price: product?.price || 0,
        image: (product?.images && product?.images.length > 0) ? product.images[0] : '/placeholder.svg',
        quantity: cartItem.quantity,
      };
    });

    console.log('Merged cart data before setting state:', mergedCart);
    setCart(mergedCart);
  };

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const addToCart = async (item: { id: string; title: string; price: number; image: string }) => {
    console.log('Attempting to add item to cart:', item.title); // Log add initiation
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
      console.log(`Item ${item.title} already in cart, attempting to update quantity to ${newQuantity}`); // Log update intent
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
      console.log(`Successfully updated quantity for ${item.title}`); // Log successful update
    } else {
      // Item does not exist, insert new row
      console.log(`Item ${item.title} not in cart, attempting to insert`); // Log insert intent
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
      console.log(`Successfully inserted ${item.title} into cart`); // Log successful insert
    }

    // After adding/updating, re-fetch the cart to update the UI
    console.log('Refetching cart items after add/update...'); // Log refetch trigger
    fetchCartItems();
  };

  const removeFromCart = async (id: string) => {
    console.log('Attempting to remove item from cart with id:', id); // Log remove initiation
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

    console.log(`Successfully removed item with id: ${id}`); // Log successful removal

    // After removing, re-fetch the cart to update the UI
    console.log('Refetching cart items after removal...'); // Log refetch trigger
    fetchCartItems();
  };

  const updateQuantity = async (id: string, quantity: number) => {
    console.log(`Attempting to update quantity for item ${id} to ${quantity}`);

    // Optimistically update the UI
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );

    if (quantity < 1) {
      // If quantity is less than 1, remove the item
      console.log(`Quantity is less than 1 (${quantity}), removing item ${id}`);
      await removeFromCart(id);
      return;
    }

    // First, fetch the current quantity to ensure the item exists and get the current quantity
    const { data: currentItemData, error: fetchError } = await supabase
      .from('cart_items')
      .select('product_id, quantity')
      .eq('session_id', sessionId)
      .eq('product_id', id)
      .single();

    console.log("Supabase fetch response in updateQuantity:", { currentItemData, fetchError });

    if (fetchError) {
      console.error('Error fetching item for quantity update:', fetchError);
      // Optionally add a user-facing notification here
      return;
    }

    if (!currentItemData) {
      console.warn(`Item with id ${id} not found in cart for quantity update.`);
      // Item not found, maybe it was removed concurrently? Or a logic error elsewhere.
      // Depending on desired behavior, might add it here or just stop.
      // For now, we'll stop.
      return;
    }

    // Now, update the quantity
    const { data: updateData, error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('session_id', sessionId)
      .eq('product_id', id);

    console.log("Supabase update response:", { updateData, updateError });

    if (updateError) {
      console.error('Error updating item quantity in cart:', updateError);
      // Optionally add a user-facing notification here
      return;
    }

    // No explicit re-fetch here, relying on optimistic update for immediate feedback
    // and potential re-fetch on component mount or other triggers if needed for strict consistency.
  };

  const clearCart = async () => {
    console.log('Attempting to clear cart for session ID:', sessionId); // Log the session ID
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);

    console.log("Supabase delete response in clearCart:", { error }); // Log the Supabase response

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
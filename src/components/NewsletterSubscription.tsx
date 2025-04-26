import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Thank you for subscribing to our Heritage Circle!');
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center py-12 px-4">
      <h2 className="text-3xl font-serif mb-4">Join Our Heritage Circle</h2>
      <p className="text-muted-foreground mb-8">
        Subscribe to receive updates about new arrivals, exclusive invitations to cultural events,
        and insights into Indian heritage
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button 
          type="submit" 
          variant="default"
          disabled={isLoading}
          className="bg-[#4A3E3E] hover:bg-[#3A2E2E] text-white"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe Now'}
        </Button>
      </form>
      
      {message && (
        <p className={`mt-4 ${message.includes('error') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
      
      <p className="text-sm text-muted-foreground mt-4">
        By subscribing, you agree to receive our newsletter. Your privacy is important to us.
      </p>
    </div>
  );
};

export default NewsletterSubscription; 
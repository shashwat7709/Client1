import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Select } from "../ui/select";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

const NewsletterDashboard = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Newsletter form state
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('update'); // 'update' or 'offer'
  const [offerDetails, setOfferDetails] = useState({
    discount: '',
    validUntil: '',
    code: '',
  });
  const [offerTitle, setOfferTitle] = useState('');

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch('/api/admin/subscribers');
        const data = await response.json();
        if (response.ok) {
          setSubscribers(data.subscribers);
        }
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      }
    };

    fetchSubscribers();
  }, []);

  // Send newsletter
  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let imageUrls: string[] = [];
    if (type === 'offer' && uploadedImages.length > 0) {
      setUploading(true);
      try {
        // Upload each image to Supabase Storage
        const { supabase } = await import('../../config/supabase');
        const uploadPromises = uploadedImages.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          const { data, error } = await supabase.storage.from('offer-images').upload(fileName, file, { upsert: false });
          if (error) throw error;
          // Get public URL
          const { data: publicUrlData } = supabase.storage.from('offer-images').getPublicUrl(fileName);
          return publicUrlData.publicUrl;
        });
        imageUrls = await Promise.all(uploadPromises);
      } catch (err) {
        setMessage('Image upload failed. Please try again.');
        setIsLoading(false);
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    try {
      const response = await fetch('/api/admin/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content,
          type,
          ...(type === 'offer' && { offerDetails }),
          ...(type === 'offer' && { title: offerTitle }),
          images: imageUrls, // Always include images array (empty if none)
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Newsletter sent successfully!');
        setSubject('');
        setContent('');
        setOfferDetails({ discount: '', validUntil: '', code: '' });
        setUploadedImages([]);
        setImagePreviews([]);
        setOfferTitle('');
      } else {
        setMessage(data.error || 'Failed to send newsletter');
      }
    } catch (error) {
      setMessage('Failed to send newsletter');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTemplateContent = () => {
    if (type === 'offer') {
      return `🎉 Special Offer Alert! 🎉

${content}

Exclusive Discount: ${offerDetails.discount}
Use Code: ${offerDetails.code}
Valid Until: ${offerDetails.validUntil}

Shop Now: [Your Store Link]

Terms and conditions apply.`;
    }
    return content;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Newsletter Dashboard</h1>

      {/* Subscriber Stats */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Subscriber Statistics</h2>
        <p className="text-2xl font-bold">{subscribers.length} Total Subscribers</p>
      </Card>

      {/* Send Newsletter Form */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Send Newsletter</h2>
        <form onSubmit={handleSendNewsletter} className="space-y-4">
          <div>
            <label htmlFor="type" className="block mb-2">Newsletter Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="update">General Update</option>
              <option value="offer">Special Offer</option>
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block mb-2">Subject</label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Newsletter Subject"
              required
            />
          </div>
          
          {type === 'offer' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="offer-title" className="block mb-2">Offer Title</label>
                <Input
                  id="offer-title"
                  value={offerTitle}
                  onChange={e => setOfferTitle(e.target.value)}
                  placeholder="e.g., Summer Sale - 20% Off!"
                  required
                />
              </div>
              <div>
                <label htmlFor="discount" className="block mb-2">Discount</label>
                <Input
                  id="discount"
                  value={offerDetails.discount}
                  onChange={(e) => setOfferDetails(prev => ({ ...prev, discount: e.target.value }))}
                  placeholder="e.g., 20% OFF"
                  required
                />
              </div>
              <div>
                <label htmlFor="code" className="block mb-2">Offer Code</label>
                <Input
                  id="code"
                  value={offerDetails.code}
                  onChange={(e) => setOfferDetails(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., HERITAGE20"
                  required
                />
              </div>
              <div>
                <label htmlFor="validUntil" className="block mb-2">Valid Until</label>
                <Input
                  id="validUntil"
                  type="date"
                  value={offerDetails.validUntil}
                  onChange={(e) => setOfferDetails(prev => ({ ...prev, validUntil: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="offer-images" className="block mb-2">Offer Images (optional)</label>
                <Input
                  id="offer-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    setUploadedImages(files);
                    setImagePreviews(files.map(file => URL.createObjectURL(file)));
                  }}
                />
                {/* Preview selected images */}
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {imagePreviews.map((src, idx) => (
                      <img key={idx} src={src} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="content" className="block mb-2">Content</label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === 'offer' ? "Describe your special offer..." : "Write your newsletter content here..."}
              rows={10}
              required
              className="min-h-[200px]"
            />
          </div>

          {message && (
            <p className={`${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#4A3E3E] hover:bg-[#3A2E2E] text-white"
          >
            {isLoading ? 'Sending...' : 'Send Newsletter'}
          </Button>
        </form>
      </Card>

      {/* Subscribers List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Subscribers List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Subscribed Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-t">
                  <td className="py-2">{subscriber.email}</td>
                  <td className="py-2">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default NewsletterDashboard; 
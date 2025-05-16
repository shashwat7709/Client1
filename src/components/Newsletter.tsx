import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../config/supabase';

interface Offer {
  id: string;
  images: string[];
  content: string;
  created_at: string;
}

const Newsletter = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_offers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setOffers(data);
      }
      setLoading(false);
    };
    fetchOffers();
  }, []);

  return (
    <section className="py-24 bg-[#F5F1EA] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-paisley-pattern opacity-5" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-saffron/10 rounded-full mix-blend-multiply filter blur-xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indianRed/10 rounded-full mix-blend-multiply filter blur-xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display text-[#46392d] mb-4">
            Offers
          </h2>
          <p className="text-[#46392d]/70 mb-8 max-w-2xl mx-auto font-body text-base">
            Discover our latest exclusive offers and special deals curated just for you. Check back often for new ways to save on authentic heritage products!
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[180px] bg-white/60 rounded-lg border border-[#46392d]/10 shadow-inner p-8">
              <span className="text-[#46392d]/40 text-lg font-serif">Loading offers...</span>
            </div>
          ) : offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[180px] bg-white/60 rounded-lg border border-[#46392d]/10 shadow-inner p-8">
              <span className="text-[#46392d]/40 text-lg font-serif">No active offers at the moment.<br />Stay tuned for upcoming deals!</span>
            </div>
          ) : (
            <div className="grid gap-8">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white/80 rounded-lg border border-[#46392d]/10 shadow p-6 text-left">
                  {offer.images && offer.images.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-4 mb-4">
                      {offer.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Offer ${offer.id} Image ${idx + 1}`}
                          className="w-40 h-40 object-cover rounded-md border border-[#46392d]/20"
                        />
                      ))}
                    </div>
                  )}
                  <div className="text-[#46392d] text-lg font-serif mb-2 whitespace-pre-line">{offer.content}</div>
                  <div className="text-xs text-[#46392d]/50 text-right">{new Date(offer.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}

          {/* Decorative Elements */}
          <div className="absolute -left-4 top-1/4 w-24 h-24 border-2 border-primary/20 rounded-full opacity-20" />
          <div className="absolute -right-4 bottom-1/4 w-32 h-32 border-2 border-primary/20 rounded-full opacity-20" />
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter; 
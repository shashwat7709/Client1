import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

interface Offer {
  id: string;
  images: string[];
  content: string;
  created_at: string;
}

const Newsletter = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            <div className="grid gap-12">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative bg-gradient-to-br from-[#fff8f1] to-[#f5f1ea] rounded-3xl border border-[#e2d6c2] shadow-2xl px-4 pt-8 pb-6 md:pt-12 md:pb-10 md:px-10 max-w-3xl mx-auto flex flex-col items-center overflow-visible group transition-transform hover:scale-[1.015] hover:shadow-3xl"
                >
                  {/* Special Offer Tab */}
                  <div className="absolute -top-6 left-0 w-56 sm:w-64 md:w-72 h-12 flex items-center bg-[#e6cfa7] text-[#46392d] text-2xl font-bold shadow-lg rounded-tl-3xl rounded-tr-2xl rounded-br-2xl z-10 border border-[#e2d6c2] justify-start pl-6" style={{borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem'}}>
                    Special Offer
                  </div>
                  {/* Images Row */}
                  {offer.images && offer.images.length > 0 && (
                    <div className="flex flex-row justify-center gap-4 w-full mt-8 mb-6">
                      {offer.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Offer ${offer.id} Image ${idx + 1}`}
                          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border-2 border-[#e2d6c2] shadow-md bg-white"
                        />
                      ))}
                    </div>
                  )}
                  {/* Details Section */}
                  <div className="flex items-center justify-between w-full max-w-2xl mb-2 px-2">
                    <span className="inline-block bg-[#46392d] text-[#fff8f1] px-6 py-2 rounded-full text-base font-semibold tracking-wide shadow">LIMITED TIME</span>
                    <span className="text-xs text-[#46392d]/50 ml-2">{new Date(offer.created_at).toLocaleDateString()}</span>
                  </div>
                  {/* Offer Content */}
                  <div className="text-[#46392d]/90 text-xl md:text-2xl font-serif text-center mb-6 whitespace-pre-line leading-relaxed px-4 md:px-8 font-normal tracking-normal">
                    {offer.content}
                  </div>
                  {/* Call to Action */}
                  <button
                    className="mx-auto bg-gradient-to-r from-[#46392d] to-[#7c6247] text-white px-10 py-3 rounded-xl shadow-lg text-lg font-semibold hover:from-[#7c6247] hover:to-[#46392d] transition-colors focus:outline-none focus:ring-4 focus:ring-[#e6cfa7]/50"
                    onClick={() => navigate('/shop')}
                  >
                    Shop Now
                  </button>
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
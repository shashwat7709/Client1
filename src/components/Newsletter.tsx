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
            <div className="grid gap-12">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative bg-gradient-to-br from-[#fff8f1] to-[#f5f1ea] rounded-3xl border border-[#e2d6c2] shadow-2xl p-8 md:p-12 max-w-3xl mx-auto flex flex-col items-center gap-4 overflow-hidden group transition-transform hover:scale-[1.025] hover:shadow-3xl"
                >
                  {/* Decorative Ribbon */}
                  <div className="absolute top-0 left-0 bg-[#e6cfa7] text-[#46392d] px-6 py-2 rounded-br-2xl text-lg font-bold shadow-md z-10">
                    Special Offer
                  </div>
                  {/* Images Row (carousel style, above content) */}
                  {offer.images && offer.images.length > 0 && (
                    <div className="flex flex-row justify-center gap-4 w-full mb-4">
                      {offer.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Offer ${offer.id} Image ${idx + 1}`}
                          className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-xl border-2 border-[#e2d6c2] shadow-md transition-transform group-hover:scale-105 hover:ring-4 hover:ring-[#e6cfa7]/40 cursor-pointer bg-white"
                        />
                      ))}
                    </div>
                  )}
                  {/* Offer Content */}
                  <div className="w-full flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-2 w-full justify-center">
                      <span className="inline-block bg-[#46392d] text-[#fff8f1] px-4 py-1 rounded-full text-base font-semibold tracking-wide shadow">LIMITED TIME</span>
                      <span className="text-xs text-[#46392d]/50 ml-auto">{new Date(offer.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[#46392d] text-2xl md:text-3xl font-serif font-bold mb-2 whitespace-pre-line leading-snug text-center">
                      {offer.content}
                    </div>
                    <button
                      className="mt-2 bg-gradient-to-r from-[#46392d] to-[#7c6247] text-white px-8 py-3 rounded-xl shadow-lg text-lg font-semibold hover:from-[#7c6247] hover:to-[#46392d] transition-colors focus:outline-none focus:ring-4 focus:ring-[#e6cfa7]/50"
                    >
                      Shop Now
                    </button>
                  </div>
                  {/* Decorative background shape */}
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#e6cfa7]/30 rounded-full blur-2xl z-0" />
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
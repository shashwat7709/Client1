import React from 'react';

function StaticMap() {
  return (
    <div className="relative w-full h-full bg-[#F5F1EA] rounded-lg overflow-hidden">
      {/* Static map background */}
      <div 
        className="absolute inset-0 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(/photos/general/map_image.png)` }}
      >
        {/* Location details */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
          <h3 className="font-medium text-[#46392d] text-sm mb-1">The Vintage Cottage</h3>
          <p className="text-[#46392d]/70 text-xs">
            Shop No 1, Sai Sagar Building, MG Road, Camp, Pune
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid pattern overlay */}
          <div className="w-full h-full bg-[#46392d]/5" style={{
            backgroundImage: `
              linear-gradient(to right, #46392d1a 1px, transparent 1px),
              linear-gradient(to bottom, #46392d1a 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
          
          {/* Compass rose */}
          <div className="absolute top-4 right-4 w-12 h-12 border-2 border-[#46392d]/20 rounded-full bg-white/50 backdrop-blur-sm">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-[#46392d]/40 rounded-full"></div>
              <div className="absolute h-8 w-1 bg-gradient-to-t from-transparent via-[#46392d]/20 to-[#46392d]/40"
                   style={{ transform: 'rotate(0deg)' }}></div>
              <div className="absolute h-6 w-1 bg-gradient-to-t from-transparent to-[#46392d]/20"
                   style={{ transform: 'rotate(90deg)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaticMap; 
import React, { useEffect, useState } from 'react';
import { SimulationResult } from '../types';

interface ServingModalProps {
  result: SimulationResult;
  onClose: () => void;
}

export const ServingModal: React.FC<ServingModalProps> = ({ result, onClose }) => {
  const [price, setPrice] = useState<string>("0.00");
  const [wittyLine, setWittyLine] = useState("");

  const WITTY_LINES = [
    "That'll be $18.50 please.",
    "Los Angeles pricing applied.",
    "Bio-hacking complete.",
    "Your nutrition boost is ready.",
    "Adding 20% gratuity...",
    "Consumed in 3... 2... 1...",
    "Erewhon would charge $22 for this.",
    "Uploading nutrients to cloud...",
    "Sip responsibly."
  ];

  useEffect(() => {
    // Generate a random high price
    const randomPrice = (Math.random() * (22 - 12) + 12).toFixed(2);
    setPrice(randomPrice);

    // Pick a random line
    const randomLine = WITTY_LINES[Math.floor(Math.random() * WITTY_LINES.length)];
    setWittyLine(randomLine);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 pointer-events-auto" onClick={onClose} />

      {/* Modal Card */}
      <div className="pointer-events-auto w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-slide-up relative overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors z-50"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">{result.recipeName}</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">{wittyLine}</p>

        {/* The Glass Graphic */}
        <div className="relative w-32 h-56 mb-8 mx-auto flex items-end justify-center">

          {/* Straw Container (Z-0: Behind glass reflections, but managed visually) */}
          {/* We position it carefully so it ends near the bottom of the glass */}
          <div className="absolute bottom-4 left-1/2 ml-2 w-4 h-[120%] origin-bottom -rotate-6 z-0 pointer-events-none">
            {/* Straw Body */}
            <div className="w-full h-full bg-red-200 rounded-full relative overflow-hidden shadow-sm"
              style={{
                background: 'repeating-linear-gradient(45deg, #fca5a5, #fca5a5 10px, #ffffff 10px, #ffffff 20px)'
              }}
            ></div>
          </div>

          {/* Glass Container (Z-10) */}
          <div className="relative w-full h-48 rounded-b-[3.5rem] border-4 border-t-0 border-white/30 bg-white/5 backdrop-blur-[1px] shadow-2xl overflow-hidden z-10">
            {/* Liquid Layer */}
            <div className={`absolute bottom-0 w-full ${result.primaryColor} animate-fill-up opacity-90 transition-all duration-1000`}>
              {/* Liquid Top Surface Effect */}
              <div className="absolute top-0 w-full h-3 bg-white/30 blur-sm rounded-[100%] scale-y-50 origin-top"></div>

              {/* Bubbles */}
              <div className="absolute bottom-2 left-6 w-2 h-2 bg-white/40 rounded-full animate-float"></div>
              <div className="absolute bottom-6 right-8 w-3 h-3 bg-white/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-12 left-10 w-1.5 h-1.5 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Glass Reflections */}
            <div className="absolute top-0 right-3 w-3 h-32 bg-gradient-to-b from-white/50 to-transparent rounded-full blur-[1px] -rotate-2 pointer-events-none"></div>
            <div className="absolute bottom-5 left-6 w-8 h-6 bg-white/10 rounded-full blur-md pointer-events-none"></div>
          </div>

        </div>

        {/* Price Tag */}
        <div className="mb-6 flex flex-col items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</span>
          <span className="text-4xl font-black text-gray-800 tracking-tight">${price}</span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-black text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          VIEW HEALTH ANALYSIS
        </button>

      </div>
    </div>
  );
};
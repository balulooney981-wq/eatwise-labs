import React, { useState, useEffect } from 'react';
import { Ingredient } from '../types';

interface QuantityModalProps {
  ingredient: Ingredient;
  onConfirm: (quantity: number, unit: string) => void;
  onCancel: () => void;
}

export const QuantityModal: React.FC<QuantityModalProps> = ({ ingredient, onConfirm, onCancel }) => {
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('cup');

  // Determine logical default units based on type
  useEffect(() => {
    // Override based on specific keywords first
    const nameLower = ingredient.name.toLowerCase();
    
    if (ingredient.type === 'spice' || nameLower.includes('mint')) {
         setUnit('pinch');
         setQuantity(1);
    } 
    else if (nameLower.includes('butter') || nameLower.includes('oil') || ingredient.type === 'sugar' || nameLower.includes('seeds') || nameLower.includes('honey')) {
         setUnit('tbsp');
         setQuantity(1);
    }
    else if (ingredient.type === 'antioxidant' || nameLower.includes('berry') || nameLower.includes('berries')) {
         setUnit('cup');
         setQuantity(0.5); // Default to half cup for berries usually
    }
    else if (['base', 'liquid', 'water'].includes(ingredient.type)) {
      setUnit('cup');
      setQuantity(1);
    } 
    else if (['powder', 'caffeine'].includes(ingredient.type)) {
      setUnit('scoop');
      setQuantity(1);
    } 
    else if (['fruit', 'veggie', 'fat', 'acid'].includes(ingredient.type)) {
      // Larger items
      setUnit('whole');
      setQuantity(1);
    } 
    else {
      setUnit('item');
      setQuantity(1);
    }
  }, [ingredient]);

  const increment = () => setQuantity(q => q + 0.5);
  const decrement = () => setQuantity(q => Math.max(0.5, q - 0.5));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
        
        <div className="text-center mb-6">
          <div className="text-5xl mb-2 filter drop-shadow-md">{ingredient.emoji}</div>
          <h2 className="text-xl font-bold text-gray-800">Add {ingredient.name}</h2>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Select Portion</p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
            <button 
                onClick={decrement}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xl flex items-center justify-center transition-colors"
            >
                −
            </button>
            
            <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-4xl font-black text-gray-800">{quantity}</span>
                <span className="text-sm font-medium text-gray-500 uppercase">{unit}{quantity !== 1 && unit !== 'pinch' ? 's' : ''}</span>
            </div>

            <button 
                onClick={increment}
                className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-xl flex items-center justify-center transition-colors shadow-lg"
            >
                +
            </button>
        </div>

        <div className="flex gap-3">
            <button 
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={() => onConfirm(quantity, unit)}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200 transition-all active:scale-95"
            >
                Add to Blender
            </button>
        </div>

      </div>
    </div>
  );
};
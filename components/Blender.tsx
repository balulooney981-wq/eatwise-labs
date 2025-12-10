import React, { useState } from 'react';
import { SelectedIngredient } from '../types';

interface BlenderProps {
  selectedIngredients: SelectedIngredient[];
  onDrop: (id: string) => void;
  onRemove: (id: string) => void;
  onClear?: () => void;
  isBlending: boolean;
  onBlend: () => void;
}

export const Blender: React.FC<BlenderProps> = ({ 
  selectedIngredients, 
  onDrop, 
  onRemove,
  onClear,
  isBlending,
  onBlend
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const id = e.dataTransfer.getData('application/react-dnd');
    if (id) {
      onDrop(id);
    }
  };

  return (
    <div className="flex flex-col items-center relative">
      
      {/* Clear Button - Top Right of container area */}
      {selectedIngredients.length > 0 && !isBlending && (
        <button
          onClick={onClear}
          className="absolute -top-2 -right-4 lg:-right-12 text-xs font-medium text-gray-400 hover:text-red-500 bg-white border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-full shadow-sm transition-all z-30 flex items-center gap-1"
        >
          <span>🗑️</span> Clear
        </button>
      )}

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-56 h-80 rounded-[2.5rem] border-4 transition-all duration-300 flex flex-col justify-end overflow-hidden
          ${isBlending ? 'animate-shake' : ''}
          ${isDragOver 
            ? 'border-green-400 bg-green-50 scale-105 shadow-green-200' 
            : 'border-white bg-white/40 shadow-2xl backdrop-blur-sm'
          }
          ${isBlending ? 'border-gray-800 bg-gray-100' : ''}
        `}
        style={{
          boxShadow: isDragOver ? '0 20px 40px -10px rgba(74, 222, 128, 0.4)' : '0 20px 40px -10px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Blender Lid Visual */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200/50 border-b border-white/50 backdrop-blur-md z-10" />

        {/* Empty State */}
        {selectedIngredients.length === 0 && !isBlending && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <span className="text-4xl block mb-2 opacity-50">⬇️</span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">Click or Drop</span>
            </div>
          </div>
        )}

        {/* Ingredients in Blender */}
        {/* The container rotates when blending to simulate mixing */}
        <div className={`
             absolute inset-0 pb-12 flex items-end justify-center z-10 pointer-events-none
             ${isBlending ? 'animate-swirl' : ''}
        `}>
           <div className={`
               w-full h-full flex flex-wrap-reverse content-end justify-center gap-1 p-4
               transition-all duration-500
           `}>
                {selectedIngredients.map((item, index) => (
                  <div 
                    key={item.id}
                    // Enable pointer events on children so we can click remove
                    className={`
                      relative cursor-pointer pointer-events-auto group hover:scale-110 transition-transform
                      ${isBlending ? '' : 'animate-float'}
                    `}
                    style={{ 
                        animationDelay: `${index * 500}ms`,
                        transform: `rotate(${index * 45}deg)`
                    }}
                    onClick={() => !isBlending && onRemove(item.id)}
                  >
                     <div className="text-4xl drop-shadow-md">{item.emoji}</div>
                     
                     {/* Quantity Badge */}
                     {!isBlending && (
                       <div className="absolute -bottom-1 -right-1 bg-white border border-gray-100 text-gray-700 px-1.5 rounded-md text-[9px] font-bold shadow-sm whitespace-nowrap z-20">
                         {item.quantity}{['cup','whole','item','pinch'].includes(item.unit) ? '' : item.unit.charAt(0)}
                       </div>
                     )}

                     {!isBlending && (
                       <div className="absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20">
                         ×
                       </div>
                     )}
                  </div>
                ))}
           </div>
        </div>

        {/* Liquid/Base Visual with Wave Animation */}
        <div className={`
            absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out
            ${selectedIngredients.length > 0 ? 'h-16' : 'h-0'}
            ${isBlending ? 'bg-gray-300' : 'bg-green-100/80'}
            overflow-hidden
        `}>
            {selectedIngredients.length > 0 && (
                <div className="liquid-wave absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-40 bg-white rounded-[40%]"></div>
            )}
        </div>
      </div>

      {/* Base of Blender */}
      <div className="w-48 h-12 bg-gray-800 rounded-b-3xl mt-[-20px] z-10 shadow-lg flex items-center justify-center relative">
        <div className={`w-2 h-2 rounded-full ${isBlending ? 'bg-green-400 animate-ping' : 'bg-red-500'} absolute right-6`} />
      </div>

      <button
        onClick={onBlend}
        disabled={selectedIngredients.length < 2 || isBlending}
        className={`
          mt-8 px-8 py-3 rounded-full font-bold text-sm tracking-wide shadow-xl transition-all duration-300 transform
          ${selectedIngredients.length < 2 || isBlending
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed scale-95' 
            : 'bg-black text-white hover:bg-gray-800 hover:scale-105 hover:shadow-2xl active:scale-95'
          }
        `}
      >
        {isBlending ? 'ANALYZING...' : '⚡ ACTIVATE SIMULATION'}
      </button>
    </div>
  );
};
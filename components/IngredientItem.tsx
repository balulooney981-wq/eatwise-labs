import React from 'react';
import { Ingredient } from '../types';
import { INGREDIENTS } from '../constants';

interface IngredientItemProps {
  ingredient: Ingredient;
  isDisabled: boolean;
  onClick?: (id: string) => void;
}

export const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient, isDisabled, onClick }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('application/react-dnd', ingredient.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick(ingredient.id);
    }
  };

  // Find names of clashing ingredients for the tooltip
  const clashNames = ingredient.clashList
    .map(clashId => INGREDIENTS.find(i => i.id === clashId)?.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');

  const clashCount = ingredient.clashList.length;

  return (
    <div className="relative group tooltip-trigger">
        <div
            draggable={!isDisabled}
            onDragStart={handleDragStart}
            onClick={handleClick}
            className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 z-10
                ${isDisabled 
                ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-100' 
                : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer active:scale-95'
                }
            `}
        >
            <div className="text-3xl mb-2 select-none filter drop-shadow-sm">{ingredient.emoji}</div>
            <div className="text-xs font-semibold text-gray-600 tracking-tight">{ingredient.name}</div>
            
            {/* Visual cue for "Add" */}
            {!isDisabled && (
                <div className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">+</div>
                </div>
            )}

            {isDisabled && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gray-200" />
            )}
        </div>

        {/* Tooltip */}
        <div className="tooltip-content absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-gray-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-50">
            <div className="mb-1">
                <span className="text-gray-400 font-semibold">Nutrient:</span>
                <div className="font-bold text-white">{ingredient.primaryNutrient}</div>
            </div>
            {clashCount > 0 ? (
                <div className="border-t border-gray-700 pt-1 mt-1">
                     <span className="text-red-300 font-semibold">⚠️ Avoid Mix:</span>
                     <div className="text-gray-300 leading-tight">
                        {clashNames}{clashCount > 2 ? '...' : ''}
                     </div>
                </div>
            ) : (
                <div className="text-green-300 mt-1 font-medium">✨ Versatile</div>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
    </div>
  );
};
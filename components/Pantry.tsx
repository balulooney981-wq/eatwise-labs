import React from 'react';
import { Ingredient, SelectedIngredient } from '../types';
import { IngredientItem } from './IngredientItem';

interface PantryProps {
  ingredients: Ingredient[];
  selectedIngredients: SelectedIngredient[];
  onAdd: (id: string) => void;
}

export const Pantry: React.FC<PantryProps> = ({ ingredients, selectedIngredients, onAdd }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 w-full min-h-[300px] flex flex-col transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detected Ingredients</h2>
        {ingredients.length > 0 && (
          <span className="text-xs font-medium text-gray-300 bg-gray-50 px-2 py-1 rounded-full">
            {ingredients.length} Items
          </span>
        )}
      </div>
      
      {ingredients.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
           <div className="text-4xl mb-3 opacity-20">🔍</div>
           <p className="text-gray-400 text-sm font-medium">No matches found</p>
           <p className="text-gray-300 text-xs mt-1">Try the guide above or generic terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto no-scrollbar">
          {ingredients.map(ingredient => {
            const isSelected = selectedIngredients.some(i => i.id === ingredient.id);
            return (
              <IngredientItem 
                key={ingredient.id} 
                ingredient={ingredient} 
                isDisabled={isSelected}
                onClick={onAdd}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Ingredient, SelectedIngredient } from '../types';
import { INGREDIENTS } from '../constants';
import { IngredientItem } from './IngredientItem';

interface SmoothieBuilderProps {
  selectedIngredients: SelectedIngredient[];
  onAdd: (id: string) => void;
}

interface BuilderSectionProps {
    title: string;
    description: string;
    ingredients: Ingredient[];
    bgColor: string;
    selectedIngredients: SelectedIngredient[];
    onAdd: (id: string) => void;
}

// Sub-component for individual sections to manage expansion state independently
const BuilderSection: React.FC<BuilderSectionProps> = ({ 
    title, 
    description, 
    ingredients, 
    bgColor, 
    selectedIngredients, 
    onAdd 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    // How many items to show initially to keep it clean
    const INITIAL_COUNT = 6;
    
    const visibleIngredients = isExpanded ? ingredients : ingredients.slice(0, INITIAL_COUNT);
    const hasMore = ingredients.length > INITIAL_COUNT;

    return (
        <div className={`rounded-3xl p-5 border border-gray-100 ${bgColor} flex flex-col transition-all duration-300 hover:shadow-sm`}>
            <div className="mb-4 text-center">
                <h3 className="text-sm font-bold text-gray-800 tracking-tight">{title}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mt-1">{description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {visibleIngredients.map(ing => {
                    const isSelected = selectedIngredients.some(i => i.id === ing.id);
                    return (
                        <div key={ing.id} className="scale-95 transform origin-top">
                            <IngredientItem 
                                ingredient={ing} 
                                isDisabled={isSelected} 
                                onClick={onAdd}
                            />
                        </div>
                    );
                })}
            </div>

            {hasMore && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 py-2 text-[10px] font-bold text-gray-400 hover:text-gray-700 uppercase tracking-widest w-full text-center transition-colors border-t border-gray-200/50"
                >
                    {isExpanded ? 'Show Less' : `+ ${ingredients.length - INITIAL_COUNT} More`}
                </button>
            )}
        </div>
    );
};

export const SmoothieBuilder: React.FC<SmoothieBuilderProps> = ({ selectedIngredients, onAdd }) => {
  // Group ingredients by their "Step" in the flow
  const sections = [
    {
      title: "1. The Base",
      description: "Liquid Foundation",
      types: ['base', 'liquid'],
      bgColor: "bg-blue-50/50"
    },
    {
      title: "2. The Fruits",
      description: "Sweetness & Fiber",
      types: ['fruit', 'antioxidant', 'acid'],
      bgColor: "bg-orange-50/50"
    },
    {
      title: "3. The Greens",
      description: "Micronutrients",
      types: ['green', 'veggie'],
      bgColor: "bg-green-50/50"
    },
    {
      title: "4. The Boosts",
      description: "Powders, Spices & Sweets",
      types: ['powder', 'caffeine', 'spice', 'fat', 'flavor', 'sugar'],
      bgColor: "bg-purple-50/50"
    },
    {
      title: "5. The Crunch",
      description: "Nuts & Seeds",
      types: ['nut'],
      bgColor: "bg-amber-50/50"
    }
  ];

  return (
    <div className="w-full max-w-6xl mb-8 animate-in fade-in duration-500">
      
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Build Your Blend</h2>
        <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">
          <span>Base</span>
          <span className="text-gray-300">→</span>
          <span>Fruit</span>
          <span className="text-gray-300">→</span>
          <span>Green</span>
          <span className="text-gray-300">→</span>
          <span>Boost</span>
          <span className="text-gray-300">→</span>
          <span>Crunch</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
        {sections.map((section, idx) => {
          // Filter ingredients for this section
          const sectionIngredients = INGREDIENTS.filter(ing => section.types.includes(ing.type));
          
          return (
            <BuilderSection
                key={idx}
                title={section.title}
                description={section.description}
                bgColor={section.bgColor}
                ingredients={sectionIngredients}
                selectedIngredients={selectedIngredients}
                onAdd={onAdd}
            />
          );
        })}
      </div>
    </div>
  );
};

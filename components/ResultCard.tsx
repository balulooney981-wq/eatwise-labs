
import React, { useState } from 'react';
import { SimulationResult, SuggestedAction } from '../types';

interface ResultCardProps {
  result: SimulationResult | null;
  isLoading: boolean;
  onReset: () => void;
  onSave: () => void;
  isSaved?: boolean;
  onFixAction?: (action: SuggestedAction) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, isLoading, onReset, onSave, isSaved, onFixAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white/50 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg p-8 text-center animate-pulse min-h-[400px]">
        <div className="text-4xl mb-4 animate-spin">🧬</div>
        <h3 className="text-gray-500 font-medium text-sm">Analyzing Interactions...</h3>
        <p className="text-gray-400 text-xs mt-2">Checking verified sources & synergy</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-3xl border border-white/20 p-8 text-center opacity-60 min-h-[400px]">
        <div className="text-4xl mb-4 grayscale opacity-50">🥤</div>
        <h3 className="text-gray-400 font-medium text-sm">Waiting for Simulation</h3>
        <p className="text-gray-400 text-xs mt-2">Add at least 2 ingredients</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className={`${result.primaryColor} h-32 relative flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <span className="text-7xl relative z-10 drop-shadow-lg filter brightness-110">🥤</span>
        
        {/* Score Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
          <span className="text-[10px] font-bold text-gray-500 uppercase mr-1">Bio-Score</span>
          <span className={`text-sm font-black ${result.bioScore > 8 ? 'text-green-600' : 'text-amber-600'}`}>
            {result.bioScore}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded-md">Analysis Complete</span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2 mt-2">
            {result.recipeName}
        </h2>
        
        {/* Short Summary (always visible) */}
        <p className="text-gray-800 text-sm font-medium mb-3">
            ✨ Benefit: {result.targetOutcome}
        </p>

        {/* AI Recommendation Box */}
        {result.recommendation && (
            <div className={`mb-4 p-3 rounded-xl flex flex-col gap-2 border ${result.bioScore < 7 ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                <div className="flex gap-3 items-start">
                    <span className="text-xl">{result.bioScore < 7 ? '⚠️' : '💡'}</span>
                    <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wide ${result.bioScore < 7 ? 'text-red-500' : 'text-amber-500'}`}>
                            {result.bioScore < 7 ? 'Clash Detected' : 'Smart Tip'}
                        </p>
                        <p className={`text-xs font-medium ${result.bioScore < 7 ? 'text-red-800' : 'text-amber-800'}`}>
                            {result.recommendation}
                        </p>
                    </div>
                </div>

                {/* Fix It Action Button */}
                {result.suggestedAction && onFixAction && (
                    <button 
                        onClick={() => onFixAction(result.suggestedAction!)}
                        className={`
                            self-end text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1
                            ${result.suggestedAction.type === 'remove' 
                                ? 'bg-white text-red-500 border border-red-200 hover:bg-red-50' 
                                : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'
                            }
                        `}
                    >
                        {result.suggestedAction.type === 'remove' ? (result.suggestedAction.replacement ? '🔄' : '🗑️') : '➕'} 
                        
                        {/* If replacement exists, show swap text, otherwise show label */}
                        {result.suggestedAction.replacement 
                            ? `Swap for ${result.suggestedAction.replacement}`
                            : (result.suggestedAction.label || (result.suggestedAction.type === 'remove' ? 'Remove Item' : 'Add Item'))
                        }

                        {result.suggestedAction.scoreImpact && <span className="opacity-70 ml-1">({result.suggestedAction.scoreImpact})</span>}
                    </button>
                )}
            </div>
        )}

        {/* Energy & Nutrition Grid */}
        {result.energyData && (
          <div className="mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nutrition Estimate</h3>
             <div className="grid grid-cols-5 gap-2 text-center">
                <div className="bg-white rounded-lg p-1.5 shadow-sm col-span-1">
                  <div className="text-xs font-black text-gray-800">{result.energyData.calories}</div>
                  <div className="text-[8px] text-gray-400 font-bold uppercase">Kcal</div>
                </div>
                <div className="bg-white rounded-lg p-1.5 shadow-sm col-span-1">
                  <div className="text-xs font-bold text-gray-600">{result.energyData.protein}</div>
                  <div className="text-[8px] text-gray-400 font-bold uppercase">Prot</div>
                </div>
                <div className="bg-white rounded-lg p-1.5 shadow-sm col-span-1">
                  <div className="text-xs font-bold text-gray-600">{result.energyData.carbs}</div>
                  <div className="text-[8px] text-gray-400 font-bold uppercase">Carb</div>
                </div>
                <div className="bg-white rounded-lg p-1.5 shadow-sm col-span-1">
                  <div className="text-xs font-bold text-gray-600">{result.energyData.fat}</div>
                  <div className="text-[8px] text-gray-400 font-bold uppercase">Fat</div>
                </div>
                <div className="bg-white rounded-lg p-1.5 shadow-sm col-span-1">
                  <div className="text-xs font-bold text-orange-600">{result.energyData.sugar}</div>
                  <div className="text-[8px] text-gray-400 font-bold uppercase">Sugar</div>
                </div>
             </div>
          </div>
        )}

        {/* Collapsible Detailed Description */}
        <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
             <p className="text-gray-500 text-xs leading-relaxed mb-4 border-t border-gray-100 pt-3">
                {result.description}
            </p>
             <div className="flex flex-wrap gap-1 mb-4">
                {result.nutrients.map((n, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {n}
                    </span>
                ))}
            </div>

            {/* Verified Sources */}
            {result.sources && result.sources.length > 0 && (
                <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100 mb-2">
                    <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <span>🔍</span> Verified by Google
                    </h4>
                    <div className="flex flex-col gap-1">
                        {result.sources.slice(0, 3).map((source, idx) => (
                            <a 
                                key={idx} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] text-blue-600 hover:underline truncate"
                            >
                                {source.title}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
        
        {/* Controls */}
        <div className="mt-4 flex flex-col gap-2">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 text-left"
            >
                {isExpanded ? 'View Less' : 'View Full Analysis & Sources...'}
            </button>

            <div className="flex gap-2 mt-2">
                <button 
                    onClick={onReset}
                    className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Reset
                </button>
                <button 
                    onClick={onSave}
                    disabled={isSaved}
                    className={`flex-1 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-all
                        ${isSaved ? 'bg-green-500 cursor-default' : 'bg-black hover:bg-gray-800'}
                    `}
                >
                    {isSaved ? 'Saved ✓' : 'Save Recipe'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

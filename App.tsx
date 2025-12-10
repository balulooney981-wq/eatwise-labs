
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Ingredient, SimulationResult, SavedRecipe, SelectedIngredient, SuggestedAction } from './types';
import { INGREDIENTS, SALAD_INGREDIENTS } from './constants';
import { analyzeSmoothie, analyzeImageForIngredients, AnalysisContext } from './services/geminiService';
import { Pantry } from './components/Pantry';
import { Blender } from './components/Blender';
import { ResultCard } from './components/ResultCard';
import { SmoothieBuilder } from './components/SmoothieBuilder';
import { ServingModal } from './components/ServingModal';
import { QuantityModal } from './components/QuantityModal';

// History Management Helper
interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'smoothie' | 'salad'>('smoothie'); // Default to smoothie

  // History State for Undo/Redo
  const [history, setHistory] = useState<HistoryState<SelectedIngredient[]>>({
    past: [],
    present: [],
    future: []
  });

  // Derived state for data source
  const activeIngredientsList = appMode === 'salad' ? SALAD_INGREDIENTS : INGREDIENTS;

  // Derived state for compatibility with existing code
  const selectedIngredients = history.present;

  // Helper to update history
  const updateIngredients = (newIngredients: SelectedIngredient[]) => {
    setHistory(curr => ({
      past: [...curr.past, curr.present],
      present: newIngredients,
      future: []
    }));
  };

  const undo = () => {
    setHistory(curr => {
      if (curr.past.length === 0) return curr;
      const previous = curr.past[curr.past.length - 1];
      const newPast = curr.past.slice(0, curr.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [curr.present, ...curr.future]
      };
    });
    setResult(null); // Clear analysis on history change
    setError(null);
  };

  const redo = () => {
    setHistory(curr => {
      if (curr.future.length === 0) return curr;
      const next = curr.future[0];
      const newFuture = curr.future.slice(1);
      return {
        past: [...curr.past, curr.present],
        present: next,
        future: newFuture
      };
    });
    setResult(null);
    setError(null);
  };

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const [shelfIngredients, setShelfIngredients] = useState<Ingredient[]>([]);
  // selectedIngredients is now derived from history.present

  const [isBlending, setIsBlending] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recipeInput, setRecipeInput] = useState("");

  // UI State
  const [activeFilter, setActiveFilter] = useState('All');
  const [showServingModal, setShowServingModal] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // Modal State
  const [pendingIngredient, setPendingIngredient] = useState<Ingredient | null>(null);

  // Local Storage State
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isRecipeSaved, setIsRecipeSaved] = useState(false);

  // Analysis context for score consistency
  const [analysisContext, setAnalysisContext] = useState<AnalysisContext | undefined>(undefined);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const filterCategories = ['All', 'Fruits', 'Greens', 'Liquids', 'Boosts', 'Nuts'];

  // Load Saved Recipes on Boot
  useEffect(() => {
    const saved = localStorage.getItem('eatWiseLabsRecipes');
    if (saved) {
      try {
        setSavedRecipes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load recipes", e);
      }
    }
  }, []);

  // Effect to handle filtering ingredients based on Search OR Category Filter
  useEffect(() => {
    const normalizedInput = recipeInput.toLowerCase().trim();
    let filtered = INGREDIENTS;

    // 1. Filter by Text Input (if exists)
    if (normalizedInput) {
      const inputTokens = normalizedInput.split(/[\s,.-]+/).filter(t => t.length > 2);

      filtered = INGREDIENTS.filter(ing => {
        const ingName = ing.name.toLowerCase();

        // Direct matches
        if (normalizedInput.includes(ingName) || ingName.includes(normalizedInput)) return true;
        if (normalizedInput.includes(ing.id)) return true;

        // Keyword matches
        if (ing.keywords && ing.keywords.some(k => {
          const lowerK = k.toLowerCase();
          return normalizedInput.includes(lowerK) || lowerK.includes(normalizedInput);
        })) return true;

        // Token matches
        const ingTokens = ingName.split(/[\s,.-]+/).filter(t => t.length > 2);
        return ingTokens.some(ingToken =>
          inputTokens.some(inputToken =>
            ingToken.includes(inputToken) || inputToken.includes(ingToken)
          )
        );
      });
    }
    // 2. Filter by Category Button (if no search text)
    else if (activeFilter !== 'All') {
      filtered = INGREDIENTS.filter(ing => {
        if (activeFilter === 'Fruits') return ['fruit', 'antioxidant', 'acid'].includes(ing.type);
        if (activeFilter === 'Greens') return ['green', 'veggie'].includes(ing.type);
        if (activeFilter === 'Liquids') return ['base', 'liquid', 'water'].includes(ing.type);
        if (activeFilter === 'Nuts') return ['nut'].includes(ing.type);
        // Boosts now includes 'sugar' to align with SmoothieBuilder and logic
        if (activeFilter === 'Boosts') return ['powder', 'caffeine', 'spice', 'fat', 'flavor', 'sugar'].includes(ing.type);
        return true;
      });
    }

    setShelfIngredients(filtered);

  }, [recipeInput, activeFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRecipeInput(val);
    setError(null);
  };

  const handleGenerateIngredients = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Step 1: User clicks an ingredient -> Open Modal
  const handleInitiateAdd = useCallback((ingredientId: string) => {
    const ingredient = activeIngredientsList.find(i => i.id === ingredientId);
    if (ingredient && !selectedIngredients.some(i => i.id === ingredientId)) {
      setPendingIngredient(ingredient);
    }
  }, [selectedIngredients, activeIngredientsList]);

  // Drop is alias for Add
  const handleDrop = handleInitiateAdd;

  // Step 2: User confirms quantity in Modal -> Actually Add
  const handleConfirmAdd = (quantity: number, unit: string) => {
    if (pendingIngredient) {
      const newSelection: SelectedIngredient = {
        ...pendingIngredient,
        quantity,
        unit
      };
      // Update History
      updateIngredients([...selectedIngredients, newSelection]);

      setResult(null);
      setError(null);
      setIsRecipeSaved(false);
      setShowServingModal(false);
      setPendingIngredient(null);
    }
  };

  const handleCancelAdd = () => {
    setPendingIngredient(null);
  };

  const handleRemoveIngredient = useCallback((ingredientId: string) => {
    // Update History
    const filtered = selectedIngredients.filter(i => i.id !== ingredientId);
    updateIngredients(filtered);

    setResult(null);
    setError(null);
    setIsRecipeSaved(false);
    setShowServingModal(false);
  }, [selectedIngredients]);

  const handleClearAll = () => {
    updateIngredients([]);
    setResult(null);
    setError(null);
    setIsRecipeSaved(false);
    setShowServingModal(false);
  };

  const handleFixAction = (action: SuggestedAction) => {
    // Store context for next analysis
    const ingredientName = selectedIngredients.find(i => i.id === action.ingredientId)?.name || action.ingredientId;
    const currentScore = result?.bioScore;

    if (currentScore !== undefined) {
      setAnalysisContext({
        previousScore: currentScore,
        appliedAction: {
          type: action.type,
          ingredientName: action.type === 'add' ? action.label.replace('Add ', '') : ingredientName,
          expectedImpact: action.scoreImpact || '+1.0'
        }
      });
    }

    if (action.type === 'remove') {
      handleRemoveIngredient(action.ingredientId);
    } else if (action.type === 'add') {
      // Direct Add (Bypass Modal)
      // AI might return 'lemon' (ID) or 'Lemon' (Name)
      const matchId = action.ingredientId.toLowerCase().replace(/ /g, '_');
      const found = INGREDIENTS.find(i => i.id === matchId || i.name.toLowerCase() === action.ingredientId.toLowerCase())
        || INGREDIENTS.find(i => action.label.toLowerCase().includes(i.name.toLowerCase()));

      if (found) {
        const defaultUnit = ['liquid', 'base'].includes(found.type) ? 'cup' : 'item';
        const defaultQty = defaultUnit === 'cup' ? 1 : 1;

        const newIng: SelectedIngredient = { ...found, quantity: defaultQty, unit: defaultUnit };
        updateIngredients([...selectedIngredients, newIng]);

        setResult(null);
        setIsRecipeSaved(false);
        setShowServingModal(false);
      } else {
        console.warn("Could not find ingredient to add:", action.ingredientId);
      }

    } else if (action.type === 'swap') {
      const filtered = selectedIngredients.filter(i => i.id !== action.ingredientId);

      let newIngredients = filtered;

      if (action.replacement) {
        const replacementName = action.replacement.toLowerCase();
        // Try exact ID match first, then name partial match
        const foundReplacement = INGREDIENTS.find(i => i.id === replacementName) ||
          INGREDIENTS.find(i => i.name.toLowerCase().includes(replacementName) || replacementName.includes(i.name.toLowerCase()));

        if (foundReplacement) {
          const defaultUnit = ['liquid', 'base'].includes(foundReplacement.type) ? 'cup' : 'item';
          newIngredients = [...filtered, { ...foundReplacement, quantity: 1, unit: defaultUnit }];
        }
      }

      updateIngredients(newIngredients);
      setResult(null);
      setError(null);
      setIsRecipeSaved(false);
      setShowServingModal(false);
    }
  };

  const handleBlend = async () => {
    if (selectedIngredients.length < 2) return;

    setIsBlending(true);
    setResult(null);
    setError(null);
    setIsRecipeSaved(false);
    setShowServingModal(false);

    try {
      // Pass the full ingredient objects to get quantity data for energy calculation
      const simulationResult = await analyzeSmoothie(selectedIngredients, analysisContext, appMode);
      // Clear context after use
      setAnalysisContext(undefined);

      setTimeout(() => {
        setResult(simulationResult);
        setIsBlending(false);
        setShowServingModal(true); // Trigger the serving animation
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Failed to analyze molecular structure. Please try again.");
      setIsBlending(false);
    }
  };

  const handleReset = () => {
    handleClearAll();
  };

  const handleSaveRecipe = () => {
    if (!result || selectedIngredients.length === 0) return;

    const newRecipe: SavedRecipe = {
      id: Date.now().toString(),
      name: result.recipeName,
      date: new Date().toLocaleDateString(),
      result: result,
      ingredients: selectedIngredients
    };

    const updatedRecipes = [newRecipe, ...savedRecipes];
    setSavedRecipes(updatedRecipes);
    localStorage.setItem('eatWiseLabsRecipes', JSON.stringify(updatedRecipes));
    setIsRecipeSaved(true);
  };

  const handleLoadSavedRecipe = (saved: SavedRecipe) => {
    // Loading a saved recipe resets the history stack to that recipe
    setHistory({
      past: [history.present], // Keep current as past just in case
      present: saved.ingredients,
      future: []
    });
    setResult(saved.result);
    setIsRecipeSaved(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSavedRecipe = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedRecipes.filter(r => r.id !== id);
    setSavedRecipes(updated);
    localStorage.setItem('eatWiseLabsRecipes', JSON.stringify(updated));
  };

  // ---- Image Upload Logic ----

  const triggerCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const triggerUpload = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];

      if (base64Data) {
        const foundIds = await analyzeImageForIngredients(base64Data);

        if (foundIds.length > 0) {
          // Direct add for now (skipping modal for bulk add convenience, or could iterate)
          // For simplicity in this UX, we add default quantities for scanned items
          const newItems: SelectedIngredient[] = [];
          foundIds.forEach(id => {
            const ing = INGREDIENTS.find(i => i.id === id);
            if (ing && !selectedIngredients.some(sel => sel.id === id)) {
              newItems.push({ ...ing, quantity: 1, unit: 'item' }); // Default
            }
          });

          if (newItems.length > 0) {
            updateIngredients([...selectedIngredients, ...newItems]);
            setRecipeInput(`Detected ${newItems.length} items from image...`);
          } else {
            setError("Ingredients found but already in blender.");
          }

        } else {
          setError("No known ingredients detected in image.");
        }
      }
      setIsAnalyzingImage(false);
    };

    reader.onerror = () => {
      setError("Failed to read image file.");
      setIsAnalyzingImage(false);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };


  // View Logic: Show Pantry if Searching OR Filtering. Show Builder if "All" and no search.
  const showPantryView = recipeInput.trim().length > 0 || activeFilter !== 'All';

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans">

      {/* Serving Modal Overlay */}
      {showServingModal && result && (
        <ServingModal result={result} onClose={() => setShowServingModal(false)} />
      )}

      {/* Quantity Selection Modal */}
      {pendingIngredient && (
        <QuantityModal
          ingredient={pendingIngredient}
          onConfirm={handleConfirmAdd}
          onCancel={handleCancelAdd}
        />
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={uploadInputRef} // No capture attribute allows gallery/file selection
        onChange={handleImageUpload}
        className="hidden"
      />

      <div className="w-full max-w-md flex flex-col items-center text-center mb-6 pt-6">
        <div className="mb-6 flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl shadow-sm mb-2">
            <img
              src="/logo.png"
              alt="EatWise Labs"
              className="h-20 w-auto object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-full mt-4 shadow-inner">
            <button
              onClick={() => setAppMode('smoothie')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${appMode === 'smoothie' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              🥤 Smoothie
            </button>
            <button
              onClick={() => setAppMode('salad')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${appMode === 'salad' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              🥗 Salad
            </button>
          </div>
        </div>

        <form onSubmit={handleGenerateIngredients} className="w-full relative group z-30">
          <div className="flex items-center bg-white p-2 rounded-full shadow-lg border border-gray-200 transition-shadow focus-within:shadow-xl focus-within:border-green-400">
            <input
              type="text"
              placeholder={isAnalyzingImage ? "Analyzing image..." : "Type recipe (e.g., 'Spinach Avocado')..."}
              className="flex-1 outline-none px-4 text-gray-600 font-medium bg-transparent placeholder-gray-300"
              value={recipeInput}
              onChange={handleInputChange}
              disabled={isAnalyzingImage}
            />

            {/* Upload Button */}
            <button
              type="button"
              onClick={triggerUpload}
              disabled={isAnalyzingImage}
              className="mr-1 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              title="Upload Photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>

            {/* Camera Button */}
            <button
              type="button"
              onClick={triggerCamera}
              disabled={isAnalyzingImage}
              className="mr-2 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              title="Take Photo"
            >
              {isAnalyzingImage ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              )}
            </button>

            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
            >
              SEARCH
            </button>
          </div>
        </form>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 z-30 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
        {filterCategories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveFilter(cat);
              if (recipeInput) setRecipeInput(''); // Clear search if clicking filter
            }}
            className={`
                px-4 py-2 rounded-full text-xs font-bold transition-all border
                ${activeFilter === cat
                ? 'bg-black text-white border-black shadow-md scale-105'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
             `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* View Switching: SmoothieBuilder OR Pantry */}
      {!showPantryView ? (
        <div className="absolute top-0 left-0 w-full z-30 px-4">
          {/* Mobile header area */}
        </div>
      ) : (
        <SmoothieBuilder
          selectedIngredients={selectedIngredients}
          onAdd={handleInitiateAdd}
          ingredientsList={activeIngredientsList}
          mode={appMode}
        />
      )}

      <main className="w-full max-w-6xl flex flex-col lg:flex-row items-start justify-center gap-12 mt-4 relative">

        {/* Left: Spacer on large screens to keep blender centered if Pantry is hidden */}
        <div className="hidden lg:block w-full max-w-xs">
          {/* Optional: We could put tips here or recently viewed */}
        </div>

        {/* Center: Blender */}
        <section className="flex flex-col items-center z-20 flex-1 min-w-[300px]">
          <div className="flex gap-4 mb-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 transition-all ${canUndo ? 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50' : 'bg-gray-100 border-transparent text-gray-300 cursor-not-allowed'}`}
              title="Undo last action"
            >
              ↩ Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 transition-all ${canRedo ? 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50' : 'bg-gray-100 border-transparent text-gray-300 cursor-not-allowed'}`}
              title="Redo action"
            >
              Redo ↪
            </button>
          </div>

          <Blender
            selectedIngredients={selectedIngredients}
            onDrop={handleDrop}
            onRemove={handleRemoveIngredient}
            onClear={handleClearAll}
            isBlending={isBlending}
            onBlend={handleBlend}
            mode={appMode}
          />
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 max-w-xs text-center animate-pulse">
              {error}
            </div>
          )}
        </section>

        {/* Right: Results & Saved Recipes */}
        <section className="w-full max-w-xs flex flex-col gap-6 z-10 sticky top-4">
          <ResultCard
            result={result}
            isLoading={isBlending}
            onReset={handleReset}
            onSave={handleSaveRecipe}
            isSaved={isRecipeSaved}
            onFixAction={handleFixAction}
          />

          {/* Saved Recipes List */}
          {savedRecipes.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Saved Recipes</h3>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto no-scrollbar">
                {savedRecipes.map(saved => (
                  <div
                    key={saved.id}
                    onClick={() => handleLoadSavedRecipe(saved)}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors group border border-transparent hover:border-blue-100"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-xs text-gray-700">{saved.name}</div>
                      <div className="text-[10px] text-gray-400">{saved.ingredients.length} ingredients • {saved.date}</div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSavedRecipe(e, saved.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </main>


      <footer className="w-full text-center py-4 text-[10px] text-gray-300">
        v2.0 • Salad Mode Enabled 🥗
      </footer>
    </div>
  );
};

export default App;

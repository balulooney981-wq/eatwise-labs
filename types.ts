
export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  type: 'green' | 'veggie' | 'fruit' | 'antioxidant' | 'fat' | 'liquid' | 'base' | 'nut' | 'caffeine' | 'powder' | 'spice' | 'sugar' | 'flavor' | 'acid' | 'protein' | 'grain' | 'oil' | 'dressing' | 'seed' | 'carb';
  color: string;
  keywords?: string[];
  primaryNutrient: string;
  clashList: string[]; // List of IDs this ingredient clashes with
}

export interface SelectedIngredient extends Ingredient {
  quantity: number;
  unit: string;
}

export interface SuggestedAction {
  type: 'add' | 'remove' | 'swap';
  ingredientId: string;
  label: string;
  scoreImpact: string;
  replacement?: string; // The ID or Name of the replacement ingredient
}

export interface EnergyData {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  sugar: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface SimulationResult {
  recipeName: string;
  description: string;
  bioScore: number;
  targetOutcome: string;
  primaryColor: string; // Tailwind class mostly
  nutrients: string[];
  recommendation?: string;
  suggestedAction?: SuggestedAction;
  energyData?: EnergyData;
  sources?: Source[];
}

export interface SavedRecipe {
  id: string;
  name: string;
  date: string;
  result: SimulationResult;
  ingredients: SelectedIngredient[];
}

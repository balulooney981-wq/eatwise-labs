
import { Ingredient } from './types';

export const INGREDIENTS: Ingredient[] = [
  // GREENS & VEGGIES
  { 
    id: 'spinach', 
    name: 'Spinach', 
    emoji: '🥬', 
    type: 'green', 
    color: 'bg-green-200', 
    keywords: ['greens', 'leafy'],
    primaryNutrient: 'Iron',
    clashList: ['espresso', 'matcha']
  },
  { 
    id: 'kale', 
    name: 'Kale', 
    emoji: '🥦', 
    type: 'green', 
    color: 'bg-green-300', 
    keywords: ['greens', 'leafy'],
    primaryNutrient: 'Vitamin K',
    clashList: []
  },
  { 
    id: 'cucumber', 
    name: 'Cucumber', 
    emoji: '🥒', 
    type: 'veggie', 
    color: 'bg-green-100', 
    keywords: ['cuke', 'hydration'],
    primaryNutrient: 'Hydration',
    clashList: ['strawberries', 'orange', 'lemon']
  },
  { 
    id: 'carrot', 
    name: 'Carrot', 
    emoji: '🥕', 
    type: 'veggie', 
    color: 'bg-orange-200', 
    keywords: ['root', 'beta'],
    primaryNutrient: 'Beta Carotene',
    clashList: []
  },
  { 
    id: 'beetroot', 
    name: 'Beetroot', 
    emoji: '❤️', 
    type: 'veggie', 
    color: 'bg-red-200', 
    keywords: ['beets', 'root', 'nitrate'],
    primaryNutrient: 'Nitrates',
    clashList: []
  },
  {
    id: 'celery',
    name: 'Celery',
    emoji: '🎋',
    type: 'veggie',
    color: 'bg-green-50',
    keywords: ['stalk', 'crunch'],
    primaryNutrient: 'Fiber & Water',
    clashList: []
  },
  {
    id: 'zucchini',
    name: 'Frz. Zucchini',
    emoji: '🥒',
    type: 'veggie',
    color: 'bg-green-100',
    keywords: ['courgette', 'creamy'],
    primaryNutrient: 'Potassium',
    clashList: []
  },

  // FRUITS
  { 
    id: 'avocado', 
    name: 'Avocado', 
    emoji: '🥑', 
    type: 'fruit',
    color: 'bg-green-100', 
    keywords: ['avo', 'fat', 'creamy'],
    primaryNutrient: 'Healthy Fats',
    clashList: []
  },
  { 
    id: 'banana', 
    name: 'Banana', 
    emoji: '🍌', 
    type: 'fruit', 
    color: 'bg-yellow-100', 
    keywords: ['frozen banana', 'potassium'],
    primaryNutrient: 'Potassium',
    clashList: []
  },
  { 
    id: 'blueberries', 
    name: 'Blueberries', 
    emoji: '🫐', 
    type: 'antioxidant', 
    color: 'bg-blue-100', 
    keywords: ['berries', 'berry'],
    primaryNutrient: 'Anthocyanins',
    clashList: ['milk']
  },
  { 
    id: 'strawberries', 
    name: 'Strawberries', 
    emoji: '🍓', 
    type: 'fruit', 
    color: 'bg-red-100', 
    keywords: ['berry', 'red'],
    primaryNutrient: 'Vitamin C',
    clashList: ['cucumber']
  },
  { 
    id: 'mango', 
    name: 'Mango', 
    emoji: '🥭', 
    type: 'fruit', 
    color: 'bg-yellow-300', 
    keywords: ['tropical', 'sweet'],
    primaryNutrient: 'Vitamin A',
    clashList: []
  },
  { 
    id: 'pineapple', 
    name: 'Pineapple', 
    emoji: '🍍', 
    type: 'fruit', 
    color: 'bg-yellow-200', 
    keywords: ['tropical', 'bromelain'],
    primaryNutrient: 'Bromelain',
    clashList: ['milk', 'yogurt', 'protein_powder', 'collagen']
  },
  { 
    id: 'apple', 
    name: 'Apple', 
    emoji: '🍎', 
    type: 'fruit', 
    color: 'bg-red-200', 
    keywords: ['fiber', 'sweet'],
    primaryNutrient: 'Pectin (Fiber)',
    clashList: []
  },
  { 
    id: 'orange', 
    name: 'Orange', 
    emoji: '🍊', 
    type: 'acid', 
    color: 'bg-orange-100', 
    keywords: ['citrus', 'vit c'],
    primaryNutrient: 'Vitamin C',
    clashList: ['milk', 'yogurt', 'mint']
  },
  { 
    id: 'lemon', 
    name: 'Lemon', 
    emoji: '🍋', 
    type: 'acid', 
    color: 'bg-yellow-200', 
    keywords: ['citrus', 'sour'],
    primaryNutrient: 'Vitamin C',
    clashList: ['milk', 'yogurt']
  },
  { 
    id: 'acai', 
    name: 'Acai Berry', 
    emoji: '🟣', 
    type: 'antioxidant', 
    color: 'bg-purple-800', 
    keywords: ['superfood', 'berry', 'bowl'],
    primaryNutrient: 'Anthocyanins',
    clashList: ['milk']
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    emoji: '🍉',
    type: 'fruit',
    color: 'bg-red-300',
    keywords: ['melon', 'hydro'],
    primaryNutrient: 'L-Citrulline',
    clashList: []
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    emoji: '🥝',
    type: 'fruit',
    color: 'bg-green-300',
    keywords: ['tropical', 'vit c'],
    primaryNutrient: 'Vitamin C',
    clashList: ['milk']
  },
  {
    id: 'papaya',
    name: 'Papaya',
    emoji: '🍠',
    type: 'fruit',
    color: 'bg-orange-300',
    keywords: ['enzyme', 'tropical'],
    primaryNutrient: 'Papain',
    clashList: ['milk']
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    emoji: '🍇',
    type: 'antioxidant',
    color: 'bg-pink-400',
    keywords: ['berry', 'fiber'],
    primaryNutrient: 'Ketones',
    clashList: ['milk']
  },
  {
    id: 'peach',
    name: 'Peach',
    emoji: '🍑',
    type: 'fruit',
    color: 'bg-orange-200',
    keywords: ['stone fruit', 'sweet'],
    primaryNutrient: 'Vitamin A',
    clashList: []
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate Seeds',
    emoji: '🔴',
    type: 'antioxidant',
    color: 'bg-red-100',
    keywords: ['arils', 'superfood', 'red'],
    primaryNutrient: 'Punicalagins',
    clashList: ['milk']
  },
  {
    id: 'guava',
    name: 'Guava',
    emoji: '🍈',
    type: 'fruit',
    color: 'bg-pink-200',
    keywords: ['tropical', 'vitamin c'],
    primaryNutrient: 'Vitamin C',
    clashList: ['milk']
  },

  // BASES & LIQUIDS
  { 
    id: 'milk', 
    name: 'Cow Milk', 
    emoji: '🥛', 
    type: 'base', 
    color: 'bg-blue-50', 
    keywords: ['dairy', 'calcium'],
    primaryNutrient: 'Calcium',
    clashList: ['lemon', 'orange', 'pineapple', 'cocoa', 'acai', 'blueberries', 'kiwi', 'papaya', 'pomegranate', 'guava']
  },
  { 
    id: 'almond_milk', 
    name: 'Almond Milk', 
    emoji: '🌰', 
    type: 'liquid', 
    color: 'bg-stone-100', 
    keywords: ['nut milk', 'mylk'],
    primaryNutrient: 'Vitamin E',
    clashList: []
  },
  { 
    id: 'oat_milk', 
    name: 'Oat Milk', 
    emoji: '🌾', 
    type: 'liquid', 
    color: 'bg-stone-50', 
    keywords: ['oats', 'creamy'],
    primaryNutrient: 'Beta-glucan',
    clashList: []
  },
  { 
    id: 'yogurt', 
    name: 'Greek Yogurt', 
    emoji: '🍦', 
    type: 'base', 
    color: 'bg-blue-50', 
    keywords: ['yoghurt', 'protein'],
    primaryNutrient: 'Probiotics',
    clashList: ['lemon', 'orange', 'pineapple', 'kiwi']
  },
  { 
    id: 'coconut_water', 
    name: 'Coconut Water', 
    emoji: '🥥', 
    type: 'liquid', 
    color: 'bg-white', 
    keywords: ['coco', 'hydro'],
    primaryNutrient: 'Electrolytes',
    clashList: []
  },
  {
    id: 'soy_milk',
    name: 'Soy Milk',
    emoji: '🥛',
    type: 'base',
    color: 'bg-yellow-50',
    keywords: ['protein', 'milk'],
    primaryNutrient: 'Plant Protein',
    clashList: []
  },
  {
    id: 'water',
    name: 'Ice Water',
    emoji: '🧊',
    type: 'liquid', 
    color: 'bg-blue-50',
    keywords: ['h2o', 'base'],
    primaryNutrient: 'Hydration',
    clashList: []
  },

  // NUTS
  {
    id: 'walnuts',
    name: 'Walnuts',
    emoji: '🌰',
    type: 'nut',
    color: 'bg-amber-800',
    keywords: ['nuts', 'brain'],
    primaryNutrient: 'Omega-3',
    clashList: []
  },
  {
    id: 'almonds',
    name: 'Almonds',
    emoji: '🥔', // Visual proxy
    type: 'nut',
    color: 'bg-amber-200',
    keywords: ['nuts', 'skin'],
    primaryNutrient: 'Vitamin E',
    clashList: []
  },
  {
    id: 'cashews',
    name: 'Cashews',
    emoji: '🥐', // Visual proxy
    type: 'nut',
    color: 'bg-yellow-100',
    keywords: ['creamy', 'nuts'],
    primaryNutrient: 'Magnesium',
    clashList: []
  },
  {
    id: 'pecans',
    name: 'Pecans',
    emoji: '🥜',
    type: 'nut',
    color: 'bg-amber-900',
    keywords: ['nuts', 'antioxidant'],
    primaryNutrient: 'Zinc',
    clashList: []
  },
  {
    id: 'brazil_nuts',
    name: 'Brazil Nuts',
    emoji: '🥥',
    type: 'nut',
    color: 'bg-stone-300',
    keywords: ['selenium', 'nuts'],
    primaryNutrient: 'Selenium',
    clashList: []
  },
  {
    id: 'pistachios',
    name: 'Pistachios',
    emoji: '🍈',
    type: 'nut',
    color: 'bg-green-200',
    keywords: ['nuts', 'green'],
    primaryNutrient: 'B6',
    clashList: []
  },
  {
    id: 'macadamia',
    name: 'Macadamia',
    emoji: '⚪',
    type: 'nut',
    color: 'bg-yellow-50',
    keywords: ['fat', 'keto'],
    primaryNutrient: 'Monounsat. Fat',
    clashList: []
  },

  // FAT & PROTEIN ADD-ONS (Seeds/Butters)
  { 
    id: 'peanut_butter', 
    name: 'Peanut Butter', 
    emoji: '🥜', 
    type: 'fat', 
    color: 'bg-amber-600', 
    keywords: ['nut butter', 'pb'],
    primaryNutrient: 'Protein & Fats',
    clashList: []
  },
  { 
    id: 'chia_seeds', 
    name: 'Chia Seeds', 
    emoji: '⚫', 
    type: 'fat', 
    color: 'bg-gray-200', 
    keywords: ['seeds', 'omega'],
    primaryNutrient: 'Omega-3',
    clashList: []
  },
  {
    id: 'oats',
    name: 'Rolled Oats',
    emoji: '🥣',
    type: 'base', 
    color: 'bg-stone-100',
    keywords: ['oatmeal', 'fiber', 'grain'],
    primaryNutrient: 'Fiber (Beta-Glucan)',
    clashList: []
  },
  {
    id: 'flax_seeds',
    name: 'Flax Seeds',
    emoji: '🌾',
    type: 'fat',
    color: 'bg-amber-100',
    keywords: ['seeds', 'fiber'],
    primaryNutrient: 'Lignans',
    clashList: []
  },
  {
    id: 'hemp_seeds',
    name: 'Hemp Seeds',
    emoji: '🌱',
    type: 'fat',
    color: 'bg-green-100',
    keywords: ['hearts', 'protein'],
    primaryNutrient: 'Complete Protein',
    clashList: []
  },

  // POWDERS & ADD-ONS
  { 
    id: 'espresso', 
    name: 'Espresso', 
    emoji: '☕', 
    type: 'caffeine', 
    color: 'bg-amber-100', 
    keywords: ['coffee', 'caffeine'],
    primaryNutrient: 'Caffeine',
    clashList: ['spinach', 'kale']
  },
  { 
    id: 'matcha', 
    name: 'Matcha', 
    emoji: '🍵', 
    type: 'caffeine', 
    color: 'bg-green-400', 
    keywords: ['tea', 'green tea'],
    primaryNutrient: 'L-Theanine',
    clashList: ['spinach']
  },
  { 
    id: 'cocoa', 
    name: 'Raw Cocoa', 
    emoji: '🍫', 
    type: 'powder', 
    color: 'bg-stone-200', 
    keywords: ['chocolate', 'cacao'],
    primaryNutrient: 'Flavonoids',
    clashList: ['milk']
  },
  { 
    id: 'protein_powder', 
    name: 'Whey Protein', 
    emoji: '💪', 
    type: 'powder', 
    color: 'bg-gray-100', 
    keywords: ['muscle', 'gains'],
    primaryNutrient: 'Protein',
    clashList: ['pineapple']
  },
  { 
    id: 'spirulina', 
    name: 'Spirulina', 
    emoji: '🦠', 
    type: 'powder', 
    color: 'bg-teal-700', 
    keywords: ['algae', 'superfood'],
    primaryNutrient: 'Complete Protein',
    clashList: []
  },
  {
    id: 'collagen',
    name: 'Collagen Peptides',
    emoji: '🦴',
    type: 'powder',
    color: 'bg-blue-50',
    keywords: ['skin', 'protein', 'peptides'],
    primaryNutrient: 'Collagen Protein',
    clashList: ['pineapple']
  },
  {
    id: 'maca',
    name: 'Maca Powder',
    emoji: '🍂',
    type: 'powder',
    color: 'bg-amber-200',
    keywords: ['root', 'energy'],
    primaryNutrient: 'Adaptogens',
    clashList: []
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    emoji: '🪵',
    type: 'powder',
    color: 'bg-stone-300',
    keywords: ['stress', 'adaptogen'],
    primaryNutrient: 'Withanolides',
    clashList: []
  },
  {
    id: 'moringa',
    name: 'Moringa Powder',
    emoji: '🍃',
    type: 'powder',
    color: 'bg-green-500',
    keywords: ['leaf', 'superfood'],
    primaryNutrient: 'Iron',
    clashList: []
  },

  // SPICES & FLAVORS
  { 
    id: 'ginger', 
    name: 'Ginger', 
    emoji: '🫚', 
    type: 'spice', 
    color: 'bg-yellow-50', 
    keywords: ['root', 'spice'],
    primaryNutrient: 'Gingerol',
    clashList: []
  },
  { 
    id: 'turmeric', 
    name: 'Turmeric', 
    emoji: '🧡', 
    type: 'spice', 
    color: 'bg-orange-400', 
    keywords: ['curcumin', 'spice'],
    primaryNutrient: 'Curcumin',
    clashList: []
  },
  { 
    id: 'cinnamon', 
    name: 'Cinnamon', 
    emoji: '🪵', 
    type: 'spice', 
    color: 'bg-amber-700',
    keywords: ['spice', 'bark'],
    primaryNutrient: 'Cinnamaldehyde',
    clashList: []
  },
  { 
    id: 'mint', 
    name: 'Mint', 
    emoji: '🌿', 
    type: 'flavor', 
    color: 'bg-green-100', 
    keywords: ['fresh', 'herb'],
    primaryNutrient: 'Menthol',
    clashList: ['orange']
  },
  { 
    id: 'honey', 
    name: 'Honey', 
    emoji: '🍯', 
    type: 'sugar', 
    color: 'bg-amber-200', 
    keywords: ['sweetener'],
    primaryNutrient: 'Glucose',
    clashList: []
  },
  {
    id: 'dates',
    name: 'Medjool Dates',
    emoji: '🌴',
    type: 'fruit',
    color: 'bg-amber-900',
    keywords: ['sweet', 'fruit', 'sugar'],
    primaryNutrient: 'Natural Sugars',
    clashList: []
  },
  {
    id: 'stevia',
    name: 'Stevia',
    emoji: '🌿',
    type: 'sugar',
    color: 'bg-green-50',
    keywords: ['sweetener', 'sugar-free'],
    primaryNutrient: '0 Cal Sweetness',
    clashList: []
  },
  {
    id: 'goji',
    name: 'Goji Berries',
    emoji: '🍒',
    type: 'antioxidant',
    color: 'bg-red-500',
    keywords: ['berry', 'superfood'],
    primaryNutrient: 'Zeaxanthin',
    clashList: []
  },
  {
    id: 'bee_pollen',
    name: 'Bee Pollen',
    emoji: '🐝',
    type: 'flavor',
    color: 'bg-yellow-400',
    keywords: ['pollen', 'immunity'],
    primaryNutrient: 'Enzymes',
    clashList: []
  }
];

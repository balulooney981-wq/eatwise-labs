
import { GoogleGenAI } from "@google/genai";
import { SimulationResult, SelectedIngredient } from "../types";
import { INGREDIENTS } from "../constants";

// Fallback logic in case API fails or key is missing
const FALLBACK_RESULTS: Record<string, SimulationResult> = {
  "default": {
    recipeName: "The Mystery Blend",
    description: "A unique combination of ingredients. The bio-availability looks promising, though specific interactions are complex.",
    bioScore: 7.2,
    targetOutcome: "General Vitality",
    primaryColor: "bg-gray-600",
    nutrients: ["Fiber", "Vitamins"],
    recommendation: "Try adding some Vitamin C to boost absorption.",
    suggestedAction: {
        type: 'add',
        ingredientId: 'lemon',
        label: "Add Lemon",
        scoreImpact: "+1.5"
    },
    energyData: {
      calories: 250,
      protein: "8g",
      carbs: "45g",
      fat: "6g",
      sugar: "20g"
    }
  }
};

export const analyzeSmoothie = async (ingredients: SelectedIngredient[]): Promise<SimulationResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("No API_KEY found in process.env. Using simulation fallback.");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Prepare rich data for the prompt including QUANTITIES for accurate energy calc
    const richData = ingredients.map(ing => {
      const dbIng = INGREDIENTS.find(i => i.id === ing.id);
      const clashInfo = dbIng ? `Clashes with: ${dbIng.clashList.join(', ') || 'None'}` : '';
      const primaryNutrient = dbIng ? `Primary: ${dbIng.primaryNutrient}` : '';
      return `- ${ing.name} (Qty: ${ing.quantity} ${ing.unit}) [${primaryNutrient}] [${clashInfo}]`;
    }).join('\n');

    const prompt = `
      You are an expert Molecular Nutritionist. Analyze this smoothie blend based on the specific quantities provided.
      
      Ingredients:
      ${richData}
      
      You have access to Google Search. Use it to verify the nutritional content (calories, sugar) and chemical interactions (clashes) of these specific ingredients based on their quantity. Ensure the 'bioScore' and 'energyData' are accurate based on real-world data found via search.

      Instructions:
      1. **Name:** Creative, premium name (e.g., "The Velvet Collagen Cloud").
      2. **Molecular Description:** 
         - Explain the synergy.
         - CRITICAL: If there are clashes (e.g. Dairy + Citrus, Oxalates + Calcium), explain specifically WHY they are bad (e.g., "The casein in milk binds to the antioxidants in berries, reducing absorption by 40%"). 
         - Mention specific benefits of the key ingredients used.
      3. **Bio-Score:** 0.0 to 10.0. Penalize heavily for clashes or excessive sugar.
      4. **Target Outcome:** Main health benefit (e.g. "Gut Repair").
      5. **Color:** Choose one: "bg-green-600", "bg-purple-600", "bg-amber-800", "bg-yellow-500", "bg-red-500", "bg-blue-600", "bg-pink-500".
      6. **Nutrients:** List 3 key micronutrients found in this specific mix.
      7. **Energy Data:** Calculate total macros based on the EXACT QUANTITIES listed above.
         - Return 'calories' as a number.
         - Return protein, carbs, fat, sugar as strings with units (e.g. "25g").
         - Be precise (e.g. 1 whole banana + 1 tbsp honey is high sugar).
      8. **Recommendation & Fix:**
         - Provide a 1-sentence tip.
         - IF CLASH DETECTED: Suggest SWAPPING the clashing item.
         - IF SUGAR > 25g: Suggest removing/swapping a high-sugar item.
         - IF SCORE < 9 and NO CLASH: Suggest adding a booster.
      9. **Suggested Action:**
         - Return structured data for a button.
         - If replacing an item: type="swap", ingredientId="[ID of item to remove]", replacement="[Name of Replacement]", label="Swap [Item] for [Replacement]".
         - If simply removing: type="remove", ingredientId="[ID]", label="Remove [Item]".
         - If adding: type="add", ingredientId="[ID]", label="Add [Item]".

      OUTPUT FORMAT:
      You MUST return a valid JSON object. Do NOT wrap it in markdown code blocks. The JSON must match this structure:
      {
        "recipeName": "string",
        "description": "string",
        "bioScore": number,
        "targetOutcome": "string",
        "primaryColor": "string",
        "nutrients": ["string", "string", "string"],
        "recommendation": "string",
        "suggestedAction": {
          "type": "add" | "remove" | "swap",
          "ingredientId": "string (use exact id from input for remove/swap, or closest match for add)",
          "label": "string",
          "scoreImpact": "string (e.g. +1.5)",
          "replacement": "string (optional, required if type is swap)"
        },
        "energyData": {
          "calories": number,
          "protein": "string",
          "carbs": "string",
          "fat": "string",
          "sugar": "string"
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseSchema is NOT supported when using Google Search tools. 
        // We rely on the prompt to enforce JSON structure.
      }
    });

    if (response.text) {
      let jsonString = response.text;
      // Clean up markdown if present (e.g. ```json ... ```)
      jsonString = jsonString.replace(/```json\n?|```/g, "").trim();
      
      try {
        const result = JSON.parse(jsonString) as SimulationResult;
        
        // Extract Grounding Metadata (Sources)
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            result.sources = groundingChunks
                .map(chunk => ({
                    title: chunk.web?.title || "Verified Source",
                    uri: chunk.web?.uri
                }))
                .filter(source => source.uri) as { title: string; uri: string }[];
        }

        return result;
      } catch (parseError) {
        console.error("Failed to parse JSON from AI response:", parseError);
        console.log("Raw text:", response.text);
        return FALLBACK_RESULTS["default"];
      }
    }
    
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return FALLBACK_RESULTS["default"];
  }
};

export const analyzeImageForIngredients = async (base64Image: string): Promise<string[]> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return [];

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const inventory = INGREDIENTS.map(i => ({ id: i.id, name: i.name }));
        const inventoryString = JSON.stringify(inventory);

        const prompt = `
            Analyze this image of groceries. 
            Identify which of the following known ingredients are present in the image.
            
            Known Ingredients:
            ${inventoryString}

            Instructions:
            1. Return ONLY a valid JSON object. Do NOT use markdown code blocks.
            2. structure: { "foundIds": ["id1", "id2"] }
            3. The array should contain the 'id' of the matching ingredients.
            4. Be somewhat flexible (e.g., if you see any leafy green, match 'spinach' or 'kale').
            5. If nothing is found, return empty array.
        `;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: "image/jpeg"
            }
        };

        // Note: gemini-3-pro-preview is required for image analysis
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                parts: [
                    imagePart,
                    { text: prompt }
                ]
            }
        });
        
        if (response.text) {
             let jsonString = response.text.replace(/```json\n?|```/g, "").trim();
             try {
                const data = JSON.parse(jsonString);
                return data.foundIds || [];
             } catch (e) {
                 console.error("Failed to parse image analysis JSON", e);
                 return [];
             }
        }
        return [];

    } catch (e) {
        console.error("Image analysis failed", e);
        return [];
    }
}

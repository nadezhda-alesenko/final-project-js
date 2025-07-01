import { API_KEY } from './api-key.js'

const fetchJsonSafe = async (url, context = '') => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error (${context}): ${res.status}`);
  const data = await res.json();
  if (!data) throw new Error(`Empty response (${context})`);
  return data;
};

export async function getMealsByCalories(totalKcal) {
  const mealTypes = [
    { type: 'breakfast', min: totalKcal * 0.2, max: totalKcal * 0.25, offset: 0 },
    { type: 'main course', min: totalKcal * 0.3, max: totalKcal * 0.35, offset: 0 },  
    { type: 'main course', min: totalKcal * 0.3, max: totalKcal * 0.35, offset: 10 },  
  ];

  const detailedMeals = await Promise.all(
    mealTypes.map(async ({ type, min, max, offset }) => {
      const params = new URLSearchParams({
        type,
        minCalories: Math.floor(min),
        maxCalories: Math.ceil(max),
        number: 1,
        offset,
        addRecipeInformation: true,
        apiKey: API_KEY,
      });
      const url = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Search error (${type}): ${res.status}`);

      const data = await res.json();
      const meal = data.results[0];

      const infoUrl = `https://api.spoonacular.com/recipes/${meal.id}/information?apiKey=${API_KEY}&includeNutrition=true`;
      const info = await fetchJsonSafe(infoUrl, `recipe ${meal.id}`); 

      return {
        ...meal,
        nutrition: info.nutrition || {},
        nutrients: info.nutrition?.nutrients || [], 
        instructions: info.instructions || "Instructions not available."
      };
    })
  );

  return detailedMeals;
}


export const getMultiVitaminDish = async (vitaminParams) => {
  const params = new URLSearchParams({
    number: 3,
    apiKey: API_KEY,
    ...vitaminParams
  });
  const url = `https://api.spoonacular.com/recipes/findByNutrients?${params.toString()}`;
  

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request error: ${res.status}`);
  }

  return await res.json();
};

export const fetchRecipeInstructions = async (recipeId) => {
  const apiKey = API_KEY;
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}&includeNutrition=true`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching recipe details: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    instructions: data.instructions || "No instructions available.",
    extendedIngredients: data.extendedIngredients || [],
    nutrition: data.nutrition || null
  };
};


export const getCPFC = (nutrients, name) => {
  const nutrient = nutrients.find(n => n.name.toLowerCase() === name.toLowerCase());
  return nutrient ? `${nutrient.amount}${nutrient.unit}` : '–';
};

export const fetchDishesByFilters = async (form) => {
  const diet = form.querySelector('[name="diet"]').value;
  const type = form.querySelector('[name="type"]').value;
  const cuisine = form.querySelector('[name="cuisine"]').value;

  const intoleranceEls = form.querySelectorAll('[name="intolerances"]:checked');
  const intolerances = Array.from(intoleranceEls).map(el => el.value).join(',');

  const rawParams = {
    apiKey: API_KEY,
    number: 3,
    diet,
    type,
    cuisine,
    intolerances,
    addRecipeNutrition: true
  };
  
  const params = new URLSearchParams();
  Object.entries(rawParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const url = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.results || [];
};
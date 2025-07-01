import { getMealsByCalories, getMultiVitaminDish, fetchRecipeInstructions, fetchDishesByFilters, getCPFC } from "./api.js";
import { calculateBMR, calculateTDEE, calculateGoal } from "./calories.js";
import { createVitaminTable, calculateDailyVitamins } from "./vitamins.js"
import { drawVitaminChart } from './charts.js'
import { renderDishCard } from "./render.js"

export const calculateCalories = async (e) => {
  e.preventDefault();

  try {
    const bmr = calculateBMR();
    const tdee = calculateTDEE(bmr);
    const goalCalories = calculateGoal(tdee); 

    const summaryBox = document.querySelector('#calorieSummary');
    const mealsBox = document.querySelector('#calorieMeals');

    summaryBox.innerHTML = `
      <h3>Your diet today is approximately:</h3>
      <p><strong>Total target:</strong> ${Math.round(goalCalories)} kcal</p>
    `;

    const meals = await getMealsByCalories(goalCalories); 

    const enrichedMeals = await Promise.all(meals.map(async (meal) => {
      const { instructions, extendedIngredients } = await fetchRecipeInstructions(meal.id);
      const nutrients = meal.nutrients || [];
    
      return {
        title: meal.title,
        image: meal.image,
        calories: getCPFC(nutrients, "Calories"),
        protein: getCPFC(nutrients, "Protein"),
        fat: getCPFC(nutrients, "Fat"),
        carbs: getCPFC(nutrients, "Carbohydrates"),
        instructions,
        extendedIngredients
      };
    }));

    renderDishCard(enrichedMeals, 'calorieMeals'); 
  } catch (error) {
    document.querySelector('#calorieSummary').innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
    document.querySelector('#calorieMeals').innerHTML = '';
  }
};

  

export const calculateVitamins = async (e) => {
    e.preventDefault();
  
    const result = await calculateDailyVitamins(); 
    if (!result) return;
  
    await drawVitaminChart();
    await createVitaminTable();
};

  
export const findMultiVitaminDish = async (e) => {
    e.preventDefault();
  
    const resultBox = document.querySelector('#vitaminTableDish');
    const checkboxes = document.querySelectorAll('.vitamin-checkbox:checked');
  
    if (!checkboxes.length) {
      resultBox.innerHTML = `<p style="color:red">Select at least one vitamin</p>`;
      return;
    }
  
    const vitaminParams = {};
  
    checkboxes.forEach(cb => {
      const vitamin = cb.dataset.vitamin;
      const amount = cb.dataset.amount;
      vitaminParams[`min${vitamin}`] = amount;
    });
  
    try {
      const recipes = await getMultiVitaminDish(vitaminParams);
  
      if (!recipes.length) {
        resultBox.innerHTML = `<p>No dishes found for selected vitamins.</p>`;
        return;
      }
  
      const recipesWithInstructions = await Promise.all(
        recipes.map(async (recipe) => {
          const { instructions, extendedIngredients } = await fetchRecipeInstructions(recipe.id);
          return { ...recipe, instructions, extendedIngredients };
        })
      );
  
      renderDishCard(recipesWithInstructions, 'vitaminTableDish');
    } catch (error) {
      resultBox.innerHTML = `<p style="color:red">Ошибка: ${error.message}</p>`;
    }
};

export const showHideRecipeBtn = (e) => {
    if (e.target.classList.contains('toggle-instruction')) {
      const button = e.target;
      const instructionDiv = button.nextElementSibling;
  
      const visible = instructionDiv.style.display === 'block';
      instructionDiv.style.display = visible ? 'none' : 'block';
      button.textContent = visible ? 'Show recipe' : 'Hide recipe';
    }
};

export const handleDishFilterSubmit = async (e) => {
    e.preventDefault();
  
    const form = document.querySelector("#dishFilterForm");
    const resultBox = document.getElementById("resultFilterDish");
    resultBox.innerHTML = "";
  
    try {
      const dishes = await fetchDishesByFilters(form);
  
      if (!dishes.length) {
        resultBox.innerHTML = `<p>No matching dishes found.</p>`;
        return;
      }
  
      const enrichedDishes = await Promise.all(
        dishes.map(async (dish) => {
          const { instructions, extendedIngredients, nutrition } =
            await fetchRecipeInstructions(dish.id);
  
          return {
            title: dish.title,
            image: dish.image,
            instructions,
            extendedIngredients,
            calories: nutrition?.nutrients
              ? getCPFC(nutrition.nutrients, "Calories")
              : "–",
            protein: nutrition?.nutrients
              ? getCPFC(nutrition.nutrients, "Protein")
              : "–",
            fat: nutrition?.nutrients
              ? getCPFC(nutrition.nutrients, "Fat")
              : "–",
            carbs: nutrition?.nutrients
              ? getCPFC(nutrition.nutrients, "Carbohydrates")
              : "–",
          };
        })
      );
  
      renderDishCard(enrichedDishes, "resultFilterDish");
    } catch (error) {
      resultBox.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
    }
  };
  
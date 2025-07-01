import { showHideRecipeBtn } from './events.js'

export const renderDishCard = (recipes, containerId = 'vitaminTableDish') => {
    const template = document.getElementById("recipe-template");
    const resultBox = document.getElementById(containerId);
  
    resultBox.innerHTML = "";
  
    recipes.forEach(recipe => {
      const clone = template.content.cloneNode(true);
  
      clone.querySelector(".recipe-title").textContent = recipe.title;
      clone.querySelector(".recipe-image").src = recipe.image;
      clone.querySelector(".recipe-image").alt = recipe.title;
      clone.querySelector(".recipe-calories").textContent = recipe.calories || '–';
      clone.querySelector(".recipe-protein").textContent = recipe.protein || '–';
      clone.querySelector(".recipe-fat").textContent = recipe.fat || '–';
      clone.querySelector(".recipe-carbs").textContent = recipe.carbs || '–';
  
      const ingredientsHtml = recipe.extendedIngredients
        ? `<ul>${recipe.extendedIngredients.map(i => `<li>${i.original}</li>`).join('')}</ul>`
        : `<p>No ingredients listed.</p>`;
      clone.querySelector(".recipe-ingredients").innerHTML = ingredientsHtml;

      const instructionsDiv = clone.querySelector(".recipe-instructions");
      instructionsDiv.innerHTML = recipe.instructions || 'No instructions provided.';
      instructionsDiv.style.display = 'none';
  
      const toggleBtn = clone.querySelector('.toggle-instruction');
      toggleBtn.addEventListener('click', showHideRecipeBtn);
  
      resultBox.appendChild(clone);
    });
  };
  
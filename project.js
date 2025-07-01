import { calculateCalories, calculateVitamins, findMultiVitaminDish, handleDishFilterSubmit } from './events.js'
import{ startStory } from './story.js'

document.addEventListener("DOMContentLoaded", () => {

  const storyBtn = document.querySelector('#story-btn');
  storyBtn.addEventListener('click', startStory);

  const caloriesForm = document.querySelector('#formCalcCalories');
  caloriesForm.addEventListener('submit', calculateCalories);
  
  const vitaminsForm = document.querySelector('#formCalcVitamins');
  vitaminsForm.addEventListener('submit', calculateVitamins);

  const vitaminsDishes = document.getElementById('findMultiVitaminDish');
  vitaminsDishes.addEventListener('click', findMultiVitaminDish);

  const filterForm = document.getElementById("dishFilterForm");
  filterForm.addEventListener("submit", handleDishFilterSubmit);

});





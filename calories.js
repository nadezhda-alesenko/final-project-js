export const calculateBMR = () => {
    const sex = document.querySelector('input[id="radioMaleCalories"]:checked')?.value || 'female';
    const weight = parseFloat(document.querySelector('#weight').value);
    const height = parseFloat(document.querySelector('#height').value);
    const age = parseFloat(document.querySelector('#age').value);
  
    if (isNaN(weight) || weight < 15 || weight > 645) {
      throw new Error("Enter correct weight");
    }
    if (isNaN(height) || height < 65 || height > 250) {
      throw new Error("Enter correct height");
    }
    if (isNaN(age) || age < 1 || age > 123) {
      throw new Error("Enter correct age");
    }
  
    return sex === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  };
  
 export const calculateTDEE = (bmrResult) => {
    const activity = document.querySelector('#activityForm').value;
    let multiplier = 1.2;
  
    switch (activity) {
      case "noActivity": multiplier = 1.2; break;
      case "lowActivity": multiplier = 1.375; break;
      case "normalActivity": multiplier = 1.55; break;
      case "highActivity": multiplier = 1.725; break;
      case "everydayActivity": multiplier = 1.9; break;
    }
  
    return bmrResult * multiplier;
  };
  
 export const calculateGoal = (tdeeResult) => {
    const selectedRadio = document.querySelector('input[name="goal"]:checked');
    const goal = selectedRadio.value;
  
    const percentInput = selectedRadio.closest('.input-group')?.querySelector('input[type="text"]');
    const percent = percentInput ? parseFloat(percentInput.value.trim()) : 0;
  
    if (goal === 'losingWeight') {
      if (isNaN(percent) || "") {
        throw new Error ("Choose the correct calorie deficit. 10-20% - Optimal for sustained weight loss, minimal stress. 25% - Can be used short term but supervised (athletes, up to 4-6 weeks). >30% Not recommended: risk of metabolic slowdown, muscle loss, hormone disruption")
      } 
      if (percent<5) {
        throw new Error ("A deficit of less than 5 per cent is not significant and will not produce the expected result.");
      }
      if (percent>30) {
        throw new Error ("You have to choose your deficit percentage carefully. A deficit of more than 30 per cent entails a risk of metabolic slowdown, a risk of muscle loss, and a risk of hormonal failure");
      }
      return tdeeResult * (1 - percent / 100);
    }
  
    if (goal === 'gainingWeight') {
      if (isNaN(percent) || "") {
        throw new Error ("Choose the correct calorie surplus. +5-10% Slow but quality growth with minimum fat. +10-15% Good muscle to fat ratio with sufficient training stress. +15-20% Rapid growth, but a significant part of the mass is fat.")
      } 
      if (percent<5) {
        throw new Error ("A surplus of less than 5 per cent is not significant and will not produce the expected result.");
      }
      if (percent>20) {
        throw new Error ("You have to choose your surplus percentage carefully. The body cannot convert all excess calories into muscle at a surplus of more than 20 per cent. ");
      }
      return tdeeResult * (1 + percent / 100);
    }
  
    return tdeeResult; 
  };
  
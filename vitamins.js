
export const calculateDailyVitamins = async () => {
    const sex = document.querySelector('input[id="radioMaleVitamins"]:checked')?.value || 'female';
    const ageGroup = document.querySelector('input[name="radioAge"]:checked')?.value;

    if (!sex || !ageGroup) {
        console.warn("Select gender and age");
        return;
      }
    
      try {
        const response = await fetch('./vitamin_requirements.json');
        const vitaminData = await response.json();
    
        const vitaminResult = vitaminData[sex]?.[ageGroup];
        return vitaminResult;
      } catch (error) {
        console.error("Download error JSON:", error);
      }
    
};

export const createVitaminTable = async () => {
    const result = await calculateDailyVitamins();
    if (!result) return;
  
    const vitaminTableBody = document.getElementById("vitaminTableBody");
    vitaminTableBody.innerHTML = "";

    document.querySelector('#resultOutputVitamins').classList.remove('output-hidden');
  
    Object.entries(result).forEach(([vitamin, amount]) => {
      const apiVitaminParam = vitamin === 'Folate' || vitamin === 'Iron'
        ? vitamin
        : `Vitamin${vitamin}`;
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${vitamin}</td>
        <td>${amount}</td>
        <td>
           <input type="checkbox" class="vitamin-checkbox"
           data-vitamin="${apiVitaminParam}"
           data-amount="${amount}">
        </td>
`;
      vitaminTableBody.appendChild(row);
    });
  };
  
  



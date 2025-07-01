import { calculateDailyVitamins } from './vitamins.js';


let vitaminChartInstance = null;

export async function drawVitaminChart() {
  const result = await calculateDailyVitamins();
  if (!result) return;

  const labels = Object.keys(result);
  const data = Object.values(result);

  const ctx = document.getElementById("vitaminChart").getContext("2d");

  if (vitaminChartInstance) {
    vitaminChartInstance.destroy();
  }


  vitaminChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        label: "Daily Vitamin Needs",
        data: data,
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#F67280", "#B39EB5", "#77DD77", "#CFCFC4", "#FDFD96", 
          "#D6A2E8", "#FFDAC1", 
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right"
        },
        title: {
          display: true,
          text: "Daily Vitamin Needs"
        }
      }
    }
  });
}

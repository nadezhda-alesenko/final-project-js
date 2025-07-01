let storyIndex = 0;

const story = [
  "Lily doesn't know what to eat today...",
  "So she counts her calories with our help and finds her perfect match!",
  "And then she cooks a perfect meal!"
];

const storyImages = [
  "./pics/1.png",
  "./pics/2.png",
  "./pics/3.png"
];

const modal = document.getElementById("storyModal");
const text = document.getElementById("storyText");
const image = document.getElementById("storyImage");
const nextBtn = document.getElementById("nextStoryBtn");

export const startStory = () => {
  storyIndex = 0;
  updateSlide();
  modal.classList.remove("hidden");
};

const updateSlide = () => {
  text.innerHTML = story[storyIndex];

  image.style.opacity = '0.5';
  image.onload = () => {
    image.style.opacity = '1';
    image.alt = `story slide ${storyIndex + 1}`;
  };

  image.src = storyImages[storyIndex] + '?t=' + Date.now();

  nextBtn.textContent = storyIndex === story.length - 1 ? "Start Calculation" : "Next";
};

nextBtn.addEventListener("click", () => {
  storyIndex++;
  if (storyIndex < story.length) {
    updateSlide();
  } else {
    modal.classList.add("hidden");
    document.getElementById("formCalcCalories").scrollIntoView({ behavior: 'smooth' });
  }
});
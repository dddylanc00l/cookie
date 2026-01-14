// --- Load saved score ---
let saved = localStorage.getItem("score");
let score = saved !== null && !isNaN(saved) ? parseInt(saved) : 0;

// --- Get DOM elements ---
const cookie = document.getElementById("cookieImage");
const scoreText = document.getElementById("score");
const button = document.getElementById("oma");

// --- Track Oma purchases ---
let omaCount = parseInt(localStorage.getItem("omaCount")) || 0;

// --- Display initial values ---
scoreText.textContent = score;
button.textContent = `Oma: ${omaCount}`;

// --- Function to auto-add score based on Oma count ---
function startAutoScore() {
  setInterval(() => {
    if (omaCount > 0) {
      score += omaCount; // +1 per Oma
      scoreText.textContent = score;
      localStorage.setItem("score", score);
    }
  }, 1000);
}

// Start the auto-score interval
startAutoScore();

// --- Cookie click ---
cookie.addEventListener("click", () => {
  score++;
  scoreText.textContent = score;
  localStorage.setItem("score", score);
});

// --- Reset button ---
document.getElementById("reset").addEventListener("click", () => {
  // Reset score
  score = 0;
  scoreText.textContent = score;
  localStorage.setItem("score", score);

  // Reset Oma purchases
  omaCount = 0;
  localStorage.setItem("omaCount", omaCount);
  button.textContent = `Oma: ${omaCount}`;
});

// --- Oma button purchase ---
button.addEventListener("click", () => {
  if (score >= 50) {
    // Subtract cost immediately
    score -= 50;
    scoreText.textContent = score;
    localStorage.setItem("score", score);

    // Increment Oma count
    omaCount++;
    localStorage.setItem("omaCount", omaCount);

    // Update button text to show count
    button.textContent = `Oma: ${omaCount}`;

    // Trigger glow animation
    button.classList.add("glow");
    setTimeout(() => button.classList.remove("glow"), 500);
  }
});
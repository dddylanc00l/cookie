// --- Load saved score ---
let saved = localStorage.getItem("score");
let score = saved !== null && !isNaN(saved) ? parseInt(saved) : 0;

const OMA_COST = 50;
const FARM_COST = 200;

const OMA_PPS = 1;
const FARM_PPS = 5;

// --- Get DOM elements ---
const cookie = document.getElementById("cookieImage");
const scoreText = document.getElementById("score");
const buttonOma = document.getElementById("oma");
const buttonFarm = document.getElementById("farm");

// --- Track purchases ---
let omaCount = parseInt(localStorage.getItem("omaCount")) || 0;
let farmCount = parseInt(localStorage.getItem("farmCount")) || 0;

// --- Display initial values ---
scoreText.textContent = score;
buttonOma.textContent = `Oma: ${omaCount}`;
buttonFarm.textContent = `Farm: ${farmCount}`;

updateFarmState();

// --- Auto-add score ---
function startAutoScore() {
  setInterval(() => {
    const perSecond = (omaCount * OMA_PPS) + (farmCount * FARM_PPS);

    if (perSecond > 0) {
      score += perSecond;
      scoreText.textContent = score;
      localStorage.setItem("score", score);
    }
  }, 1000);
}

startAutoScore();

// --- Cookie click ---
cookie.addEventListener("click", () => {
  score++;
  scoreText.textContent = score;
  localStorage.setItem("score", score);
});

// --- Reset ---
document.getElementById("reset").addEventListener("click", () => {
  score = 0;
  omaCount = 0;
  farmCount = 0;

  scoreText.textContent = score;
  buttonOma.textContent = `Oma: ${omaCount}`;
  buttonFarm.textContent = `Farm: ${farmCount}`;

  localStorage.setItem("score", score);
  localStorage.setItem("omaCount", omaCount);
  localStorage.setItem("farmCount", farmCount);

  updateFarmState();
});

// --- Oma button purchase ---
buttonOma.addEventListener("click", () => {
  if (score >= OMA_COST) {
    score -= OMA_COST;
    scoreText.textContent = score;
    localStorage.setItem("score", score);

    omaCount++;
    localStorage.setItem("omaCount", omaCount);

    buttonOma.textContent = `Oma: ${omaCount}`;

    updateFarmState();

    buttonOma.classList.add("glow");
    setTimeout(() => buttonOma.classList.remove("glow"), 500);
  }
});

// --- Farm button purchase ---
buttonFarm.addEventListener("click", () => {
  if (score >= FARM_COST) {
    score -= FARM_COST;
    scoreText.textContent = score;
    localStorage.setItem("score", score);

    farmCount++;
    localStorage.setItem("farmCount", farmCount);

    buttonFarm.textContent = `Farm: ${farmCount}`;

    buttonFarm.classList.add("glow");
    setTimeout(() => buttonFarm.classList.remove("glow"), 500);
  }
});

// --- Update farm state ---
function updateFarmState() {
  if (omaCount >= 1) {
    buttonFarm.classList.remove("locked");
    buttonFarm.classList.add("unlocked");
    buttonFarm.disabled = false;
  } else {
    buttonFarm.classList.add("locked");
    buttonFarm.classList.remove("unlocked");
    buttonFarm.disabled = true;
  }
}
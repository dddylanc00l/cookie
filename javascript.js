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
const perSecondText = document.getElementById("perSecond");
const buttonFarm = document.getElementById("farm");
const gambel = document.getElementById("gok");

// --- Track purchases ---
let omaCount = parseInt(localStorage.getItem("omaCount")) || 0;
let farmCount = parseInt(localStorage.getItem("farmCount")) || 0;

updateFarmState();
updatePerSecond()

for (let i = 0; i < omaCount; i++) {
  spawnOma();
}

// --- Display initial values ---
scoreText.textContent = score;
buttonOma.textContent = `Oma: ${omaCount}`;
buttonFarm.textContent = `Farm: ${farmCount}`;


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
  updatePerSecond()
  document.getElementById("image").innerHTML = "";
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
    updatePerSecond()
    spawnOma();

    buttonOma.classList.add("glow");
    setTimeout(() => buttonOma.classList.remove("glow"), 500);
  }
});

function spawnOma() {
  const oma = document.createElement("img");
  oma.src = "oma.jpg";      // your grandma image
  oma.className = "omaSprite";
  document.getElementById("image").appendChild(oma);
}

gambel.addEventListener("click", () => {
  if (score <= 0) return; // can't gamble nothing

  const roll = Math.floor(Math.random() * 4); // 0,1,2,3

  if (roll === 0) {
    score *= 2;
    alert("You won! Your cookies doubled 🍪🍪");

  } else {

    score = 0;
    alert("You lost everything...");
  }

  scoreText.textContent = score;
  localStorage.setItem("score", score);
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

    updatePerSecond()

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

function updatePerSecond() {
  const perSecond = (omaCount * OMA_PPS) + (farmCount * FARM_PPS);
  perSecondText.textContent = `${perSecond}$ per second`;
}
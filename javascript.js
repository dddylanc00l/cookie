// --- Load saved score ---
let saved = localStorage.getItem("score");
let score = saved !== null && !isNaN(saved) ? parseInt(saved) : 0;

const OMA_COST = 50;
const FARM_COST = 200;
const MINE_COST = 1000;

const OMA_PPS = 1;
const FARM_PPS = 5;
const MINE_PPS = 25;

/* =========================
   NUMBER FORMATTER
========================= */
function formatNumber(num) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

// --- Get DOM elements ---
const cookie = document.getElementById("cookieImage");
const perSecondText = document.getElementById("perSecond");
const scoreText = document.getElementById("score");
const buttonOma = document.getElementById("oma");
const buttonFarm = document.getElementById("farm");
const buttonMine = document.getElementById("mine");
const gambel = document.getElementById("gok");

// --- Track purchases ---
let omaCount = parseInt(localStorage.getItem("omaCount")) || 0;
let farmCount = parseInt(localStorage.getItem("farmCount")) || 0;
let mineCount = parseInt(localStorage.getItem("mineCount")) || 0;

// --- Initial UI update ---
scoreText.textContent = formatNumber(score);
updatePerSecond();
updateFarmState();
updateMineState();

// --- Restore sprites ---
for (let i = 0; i < omaCount; i++) spawnOma();
for (let i = 0; i < farmCount; i++) spawnFarm();
for (let i = 0; i < mineCount; i++) spawnMine();

buttonOma.textContent = `Oma: ${omaCount}`;
buttonFarm.textContent = `Farm: ${farmCount}`;
buttonMine.textContent = `Mine: ${mineCount}`;

// --- Auto-add score ---
function startAutoScore() {
  setInterval(() => {
    const perSecond =
      omaCount * OMA_PPS +
      farmCount * FARM_PPS +
      mineCount * MINE_PPS;

    if (perSecond > 0) {
      score += perSecond;
      scoreText.textContent = formatNumber(score);
      localStorage.setItem("score", score);
    }
  }, 1000);
}

startAutoScore();

// --- Cookie click ---
cookie.addEventListener("click", () => {
  score++;
  scoreText.textContent = formatNumber(score);
  localStorage.setItem("score", score);
});

// --- Reset ---
document.getElementById("reset").addEventListener("click", () => {
  score = 0;
  omaCount = 0;
  farmCount = 0;
  mineCount = 0;

  scoreText.textContent = formatNumber(score);
  buttonOma.textContent = `Oma: 0`;
  buttonFarm.textContent = `Farm: 0`;
  buttonMine.textContent = `Mine: 0`;

  localStorage.setItem("score", score);
  localStorage.setItem("omaCount", 0);
  localStorage.setItem("farmCount", 0);
  localStorage.setItem("mineCount", 0);

  updateFarmState();
  updateMineState();
  updatePerSecond();

  document.getElementById("oma-container").innerHTML = "";
  document.getElementById("farm-container").innerHTML = "";
  document.getElementById("mine-container").innerHTML = "";

});

// --- Oma purchase ---
buttonOma.addEventListener("click", () => {
  if (score >= OMA_COST) {
    score -= OMA_COST;
    scoreText.textContent = formatNumber(score);
    localStorage.setItem("score", score);

    omaCount++;
    localStorage.setItem("omaCount", omaCount);
    buttonOma.textContent = `Oma: ${omaCount}`;

    updateFarmState();
    updateMineState();
    updatePerSecond();
    spawnOma();
  }
});

// --- Farm purchase ---
buttonFarm.addEventListener("click", () => {
  if (score >= FARM_COST) {
    score -= FARM_COST;
    scoreText.textContent = formatNumber(score);
    localStorage.setItem("score", score);

    farmCount++;
    localStorage.setItem("farmCount", farmCount);
    buttonFarm.textContent = `Farm: ${farmCount}`;

    updateMineState();
    updatePerSecond();
    spawnFarm();
  }
});

// --- Mine purchase ---
buttonMine.addEventListener("click", () => {
  if (score >= MINE_COST) {
    score -= MINE_COST;
    scoreText.textContent = formatNumber(score);
    localStorage.setItem("score", score);

    mineCount++;
    localStorage.setItem("mineCount", mineCount);
    buttonMine.textContent = `Mine: ${mineCount}`;

    updatePerSecond();
    spawnMine();
  }
});

// --- Gambling ---
gambel.addEventListener("click", () => {
  if (score <= 0) return;

  const roll = Math.floor(Math.random() * 2);

  if (roll === 0) {
    score *= 2;
    alert("You won! Your cookies doubled 🍪🍪");
  } else {
    score = 0;
    alert("You lost everything...");
  }

  scoreText.textContent = formatNumber(score);
  localStorage.setItem("score", score);
});

// --- State updates ---
function updateFarmState() {
  buttonFarm.disabled = omaCount < 1;
  buttonFarm.classList.toggle("locked", omaCount < 1);
  buttonFarm.classList.toggle("unlocked", omaCount >= 1);
}

function updateMineState() {
  buttonMine.disabled = farmCount < 1;
  buttonMine.classList.toggle("locked", farmCount < 1);
  buttonMine.classList.toggle("unlocked", farmCount >= 1);
}

function updatePerSecond() {
  const perSecond =
    omaCount * OMA_PPS +
    farmCount * FARM_PPS +
    mineCount * MINE_PPS;

  perSecondText.textContent = `${formatNumber(perSecond)}$ per second`;
}

// --- Spawning ---
function spawnOma() {
  const container = document.getElementById("oma-container");
  if (container.children.length >= 6) return;

  const oma = document.createElement("img");
  oma.src = "grandma.png";
  oma.className = "omaSprite";
  container.appendChild(oma);
}

function spawnFarm() {
  const container = document.getElementById("farm-container");
  if (container.children.length >= 6) return;

  const farm = document.createElement("img");
  farm.src = "farm.png";
  farm.className = "farmSprite";
  container.appendChild(farm);
}

function spawnMine() {
  const container = document.getElementById("mine-container");
  if (container.children.length >= 6) return;

  const mine = document.createElement("img");
  mine.src = "mine.png";
  mine.className = "mineSprite";
  container.appendChild(mine);
}
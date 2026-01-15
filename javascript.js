// --- Load saved score ---
let saved = localStorage.getItem("score");
let score = saved !== null && !isNaN(saved) ? parseInt(saved) : 0;

const OMA_COST = 50;
const FARM_COST = 200;
const MINE_COST = 1000;

const OMA_PPS = 1;
const FARM_PPS = 5;
const MINE_PPS = 25;

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

updatePerSecond()
updateFarmState();
updateMineState();

for (let i = 0; i < omaCount; i++) {
  spawnOma();
}

for (let i = 0; i < farmCount; i++) {
  spawnFarm();
}

for (let i = 0; i < mineCount; i++) {
  spawnMine();
}

// --- Display initial values ---
scoreText.textContent = score;
buttonOma.textContent = `Oma: ${omaCount}`;
buttonFarm.textContent = `Farm: ${farmCount}`;
buttonMine.textContent = `Mine: ${mineCount}`;


// --- Auto-add score ---
function startAutoScore() {
  setInterval(() => {
    const perSecond = (omaCount * OMA_PPS) + (farmCount * FARM_PPS) + (mineCount * MINE_PPS);

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
  mineCount = 0;

  scoreText.textContent = score;
  buttonOma.textContent = `Oma: ${omaCount}`;
  buttonFarm.textContent = `Farm: ${farmCount}`;
  buttonMine.textContent = `Mine: ${mineCount}`;

  localStorage.setItem("score", score);
  localStorage.setItem("omaCount", omaCount);
  localStorage.setItem("farmCount", farmCount);
  localStorage.setItem("mineCount", mineCount);

  updateFarmState();
  updateMineState();
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
    updateMineState();
    updatePerSecond()
    spawnOma();

    buttonOma.classList.add("glow");
    setTimeout(() => buttonOma.classList.remove("glow"), 500);
  }
});

function spawnOma() {
  const container = document.getElementById("oma-container");

  if (container.children.length >= 6) return;

  const oma = document.createElement("img");
  oma.src = "grandma.png";
  oma.className = "omaSprite";

  container.appendChild(oma);
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

    updateMineState();
    spawnFarm()
    updatePerSecond()

    buttonFarm.classList.add("glow");
    setTimeout(() => buttonFarm.classList.remove("glow"), 500);
  }
});

buttonMine.addEventListener("click", () => {
  if (score >= MINE_COST) {
    score -= MINE_COST;
    scoreText.textContent = score;
    localStorage.setItem("score", score);

    mineCount++;
    localStorage.setItem("mineCount", mineCount);

    buttonMine.textContent = `Mine: ${mineCount}`;

    updatePerSecond();
    spawnMine();

    buttonMine.classList.add("glow");
    setTimeout(() => buttonMine.classList.remove("glow"), 500);
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

function updateMineState() {
  if (farmCount >= 1) {
    buttonMine.classList.remove("locked");
    buttonMine.classList.add("unlocked");
    buttonMine.disabled = false;
  } else {
    buttonMine.classList.add("locked");
    buttonMine.classList.remove("unlocked");
    buttonMine.disabled = true;
  }
}

function updatePerSecond() {
  const perSecond = (omaCount * OMA_PPS) + (farmCount * FARM_PPS) + (mineCount * MINE_PPS);
  perSecondText.textContent = `${perSecond}$ per second`;
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
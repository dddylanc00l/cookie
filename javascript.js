// --- Load saved score ---
let saved = localStorage.getItem("score");
let score = saved !== null && !isNaN(saved) ? parseInt(saved) : 0;

// --- Get DOM elements ---
const cookie = document.getElementById("cookieImage");
const scoreText = document.getElementById("score");
const button = document.getElementById("oma");
const gambel = document.getElementById("gok");

// --- Track Oma purchases ---
let omaCount = parseInt(localStorage.getItem("omaCount")) || 0;

for (let i = 0; i < omaCount; i++) {
  spawnOma();
}

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

  // Remove Oma images from the screen
  document.getElementById("image").innerHTML = "";
});

// --- Oma button purchase ---
button.addEventListener("click", () => {
  if (score >= 50) {
    score -= 50;
    scoreText.textContent = score;
    localStorage.setItem("score", score);

    omaCount++;
    localStorage.setItem("omaCount", omaCount);

    button.textContent = `Oma: ${omaCount}`;

    spawnOma();

    button.classList.add("glow");
    setTimeout(() => button.classList.remove("glow"), 500);
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

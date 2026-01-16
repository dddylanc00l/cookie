/* =========================
   LOAD SCORE
========================= */
let saved = localStorage.getItem("score");
let score = saved !== null && !isNaN(saved) ? parseInt(saved) : 0;

let clickCount = 0;          // counts clicks in the current second
const maxClicksPerSecond = 50; // maximum allowed clicks per second

// Reset the click counter every 1 second
setInterval(() => {
  clickCount = 0;
}, 1000);

/* =========================
   NUMBER FORMATTER
========================= */
function formatNumber(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(2).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

/* =========================
   UPGRADE CONFIG (ADD HERE)
========================= */
const upgrades = {
  oma: {
    cost: 50,
    pps: 1,
    unlocksAt: null,
    buttonId: "oma",
    containerId: "oma-container",
    sprite: "grandma.png",
    className: "omaSprite"
  },
  farm: {
    cost: 200,
    pps: 5,
    unlocksAt: "oma",
    buttonId: "farm",
    containerId: "farm-container",
    sprite: "farm.png",
    className: "farmSprite"
  },
  mine: {
    cost: 1000,
    pps: 25,
    unlocksAt: "farm",
    buttonId: "mine",
    containerId: "mine-container",
    sprite: "mine.png",
    className: "mineSprite"
  },
  factory: {
    cost: 8000,
    pps: 150,
    unlocksAt: "mine",
    buttonId: "factory",
    containerId: "factory-container",
    sprite: "factory.png",
    className: "factorySprite"
  },
  bank: {
    cost: 40000,
    pps: 1000,
    unlocksAt: "factory",
    buttonId: "bank",
    containerId: "bank-container",
    sprite: "bank.png",
    className: "bankSprite"
  }
};

/* =========================
   DOM ELEMENTS
========================= */
const cookie = document.getElementById("cookieImage");
const scoreText = document.getElementById("score");
const perSecondText = document.getElementById("perSecond");
const resetBtn = document.getElementById("reset");
const gambleBtn = document.getElementById("gok");

/* =========================
   LOAD COUNTS
========================= */
const counts = {};
for (const key in upgrades) {
  counts[key] = parseInt(localStorage.getItem(key)) || 0;
}

/* =========================
   UI INIT
========================= */
scoreText.textContent = formatNumber(score);
updatePerSecond();
updateUnlocks();

/* =========================
   RESTORE SPRITES
========================= */
for (const type in counts) {
  for (let i = 0; i < counts[type]; i++) {
    spawnUpgrade(type);
  }
}

/* =========================
   AUTO SCORE
========================= */
setInterval(() => {
  let total = 0;
  for (const type in upgrades) {
    total += counts[type] * upgrades[type].pps;
  }

  if (total > 0) {
    score += total;
    scoreText.textContent = formatNumber(score);
    localStorage.setItem("score", score);
  }
}, 1000);

/* =========================
   COOKIE CLICK
========================= */
cookie.addEventListener("click", () => {
  if (clickCount >= maxClicksPerSecond) return; // ignore if too many clicks

  clickCount++; // count this click

  score++;
  scoreText.textContent = formatNumber(score);
  localStorage.setItem("score", score);
});


/* =========================
   RESET
========================= */
resetBtn.addEventListener("click", () => {
  // Reset score
  score = 0;
  localStorage.setItem("score", 0);
  scoreText.textContent = formatNumber(score);

  // Reset upgrades
  for (const type in upgrades) {
    counts[type] = 0;
    localStorage.setItem(type, 0);

    // Clear images
    const container = document.getElementById(upgrades[type].containerId);
    if (container) container.innerHTML = "";

    // Reset button text
    const button = document.getElementById(upgrades[type].buttonId);
    if (button) {
      button.textContent = `${capitalize(type)}: 0`;
    }
  }

  // 🔑 IMPORTANT: update AFTER everything is reset
  updatePerSecond();
  updateUnlocks();
});


/* =========================
   GAMBLING
========================= */
gambleBtn.addEventListener("click", () => {
  if (score <= 0) return;

  if (Math.random() < 0.25) {
    score *= 2;
    alert("You won! 🍪🍪");
  } else {
    score = 0;
    alert("You lost everything...");
  }

  scoreText.textContent = formatNumber(score);
  localStorage.setItem("score", score);
});

/* =========================
   BUTTON HANDLERS
========================= */
for (const type in upgrades) {
  const { cost, buttonId } = upgrades[type];
  const button = document.getElementById(buttonId);

  button.textContent = `${capitalize(type)}: ${counts[type]}`;

  button.addEventListener("click", () => {
    if (score < cost) return;

    score -= cost;
    counts[type]++;

    localStorage.setItem("score", score);
    localStorage.setItem(type, counts[type]);

    scoreText.textContent = formatNumber(score);
    button.textContent = `${capitalize(type)}: ${counts[type]}`;

    spawnUpgrade(type);
    updatePerSecond();
    updateUnlocks();
  });
}

/* =========================
   HELPERS
========================= */
function updatePerSecond() {
  let total = 0;
  for (const type in upgrades) {
    total += counts[type] * upgrades[type].pps;
  }
  perSecondText.textContent = `${formatNumber(total)}$ per second`;
}

function updateUnlocks() {
  for (const type in upgrades) {
    const { unlocksAt, buttonId } = upgrades[type];
    const button = document.getElementById(buttonId);

    const unlocked = !unlocksAt || counts[unlocksAt] > 0;
    button.disabled = !unlocked;
    button.classList.toggle("locked", !unlocked);
    button.classList.toggle("unlocked", unlocked);
  }
}

function spawnUpgrade(type) {
  const { containerId, sprite, className } = upgrades[type];
  const container = document.getElementById(containerId);

  if (!container || container.children.length >= 6) return;

  const img = document.createElement("img");
  img.src = sprite;
  img.className = className;
  container.appendChild(img);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
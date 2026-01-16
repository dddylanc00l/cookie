/* =========================
   LOAD SCORE
========================= */
let saved = localStorage.getItem("score");
let score = saved !== null && !isNaN(saved) ? parseInt(saved) : 0;

let clickCount = 0;
const maxClicksPerSecond = 50;

let weedCookieBought = localStorage.getItem("weedCookie") === "true";
const weedCookieImg = document.getElementById("weed-cookie");

// Reset click counter every second
setInterval(() => {
  clickCount = 0;
}, 1000);

/* =========================
   NUMBER FORMATTER
========================= */
function formatNumber(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(2) + "k";
  return num.toString();
}

/* =========================
   UPGRADE CONFIG
========================= */
const upgrades = {
  oma: { cost: 50, pps: 1, unlocksAt: null, buttonId: "oma", containerId: "oma-container", sprite: "grandma.png", className: "omaSprite" },
  farm: { cost: 200, pps: 5, unlocksAt: "oma", buttonId: "farm", containerId: "farm-container", sprite: "farm.png", className: "farmSprite" },
  mine: { cost: 1000, pps: 25, unlocksAt: "farm", buttonId: "mine", containerId: "mine-container", sprite: "mine.png", className: "mineSprite" },
  factory: { cost: 8000, pps: 150, unlocksAt: "mine", buttonId: "factory", containerId: "factory-container", sprite: "factory.png", className: "factorySprite" },
  bank: { cost: 40000, pps: 1000, unlocksAt: "factory", buttonId: "bank", containerId: "bank-container", sprite: "bank.png", className: "bankSprite" }
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
updateAllUpgradeButtons();
updateStore();
updatePerSecond();
updateUnlocks();
updateTooltips();

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
  const total = calculateTotalPPS();
  if (total > 0) {
    score += total;
    scoreText.textContent = formatNumber(score);
    localStorage.setItem("score", score);
    updateAllUpgradeButtons(); // update buttons to gray out unaffordable upgrades
  }
}, 1000);

/* =========================
   COOKIE CLICK
========================= */
cookie.addEventListener("click", () => {
  if (clickCount >= maxClicksPerSecond) return;
  clickCount++;
  score++;
  scoreText.textContent = formatNumber(score);
  localStorage.setItem("score", score);
  updateAllUpgradeButtons();
});

/* =========================
   RESET
========================= */
resetBtn.addEventListener("click", () => {
  score = 0;
  localStorage.setItem("score", 0);
  scoreText.textContent = formatNumber(score);

  for (const type in upgrades) {
    counts[type] = 0;
    localStorage.setItem(type, 0);
    const container = document.getElementById(upgrades[type].containerId);
    if (container) container.innerHTML = "";
  }

  weedCookieBought = false;
  localStorage.removeItem("weedCookie");

  updateStore();
  updateAllUpgradeButtons();
  updatePerSecond();
  updateTooltips();
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
  updateAllUpgradeButtons();
});

/* =========================
   UPGRADE BUTTON HANDLERS
========================= */
for (const type in upgrades) {
  const button = document.getElementById(upgrades[type].buttonId);

  updateUpgradeButton(type);

  button.addEventListener("click", () => {
    const cost = getUpgradeCost(type);
    if (score < cost) return;

    score -= cost;
    counts[type]++;

    localStorage.setItem("score", score);
    localStorage.setItem(type, counts[type]);

    scoreText.textContent = formatNumber(score);

    spawnUpgrade(type);
    updateUpgradeButton(type);
    updateStore();
    updatePerSecond();
    updateTooltips();
    updateUnlocks();
  });
}

/* =========================
   STORE (WEED COOKIE)
========================= */
function updateStore() {
  if (!weedCookieImg) return;

  weedCookieImg.classList.remove("locked", "unlocked");

  if (weedCookieBought || counts.farm >= 100) {
    weedCookieImg.classList.add("unlocked");
  } else {
    weedCookieImg.classList.add("locked");
  }
}

if (weedCookieImg) {
  weedCookieImg.addEventListener("click", () => {
    if (weedCookieBought || counts.farm < 100) return;

    weedCookieBought = true;
    localStorage.setItem("weedCookie", "true");

    alert("🌿 Weed Cookie bought! Farms now produce 20$/s");

    updateAllUpgradeButtons();
    updatePerSecond();
    updateTooltips();
    updateStore();
  });
}

/* =========================
   HELPERS
========================= */
function getEffectivePPS(type) {
  if (type === "farm" && weedCookieBought) return 20;
  return upgrades[type].pps;
}

function calculateTotalPPS() {
  let total = 0;
  for (const type in upgrades) {
    total += counts[type] * getEffectivePPS(type);
  }
  return total;
}

function updatePerSecond() {
  perSecondText.textContent =
    `${formatNumber(calculateTotalPPS())}$ per second`;
}

function getUpgradeCost(type) {
  const baseCost = upgrades[type].cost;
  const owned = counts[type];
  return Math.floor(baseCost * Math.pow(1.15, owned));
}

function updateUpgradeButton(type) {
  const button = document.getElementById(upgrades[type].buttonId);
  if (!button) return;

  const cost = getUpgradeCost(type);
  const pps = getEffectivePPS(type);

  button.textContent =
    `${capitalize(type)}: ${counts[type]} | $${formatNumber(cost)} (+${pps}$/s)`;

  // Check unlock + affordability
  const unlocked = !upgrades[type].unlocksAt || counts[upgrades[type].unlocksAt] > 0;
  const affordable = score >= cost;

  button.disabled = !unlocked || !affordable;

  // Update styling
  button.classList.toggle("locked", !unlocked || !affordable);
  button.classList.toggle("unlocked", unlocked && affordable);
}

function updateAllUpgradeButtons() {
  for (const type in upgrades) {
    updateUpgradeButton(type);
  }
}

function updateTooltips() {
  const farmTooltip = document.getElementById("farm-tooltip");
  if (!farmTooltip) return;
  farmTooltip.innerHTML =
    `$200<br>+${getEffectivePPS("farm")}$ per second`;
}

function updateUnlocks() {
  for (const type in upgrades) {
    const button = document.getElementById(upgrades[type].buttonId);
    const unlocked =
      !upgrades[type].unlocksAt ||
      counts[upgrades[type].unlocksAt] > 0;

    button.disabled = !unlocked || score < getUpgradeCost(type);
    button.classList.toggle("locked", !unlocked);
    button.classList.toggle("unlocked", unlocked);
  }
}

function spawnUpgrade(type) {
  const container = document.getElementById(upgrades[type].containerId);
  if (!container || container.children.length >= 6) return;

  const img = document.createElement("img");
  img.src = upgrades[type].sprite;
  img.className = upgrades[type].className;
  container.appendChild(img);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

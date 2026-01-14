let saved = localStorage.getItem("score");

// If it's null, undefined, or not a number, use 0
let score = saved !== null && !isNaN(saved) ? parseInt(saved) : 0;

const cookie = document.getElementById("cookieImage");
const scoreText = document.getElementById("score");

scoreText.textContent = score;

cookie.addEventListener("click", function () {
  score++;
  scoreText.textContent = score;
  localStorage.setItem("score", score);
});

document.getElementById("reset").addEventListener("click", function () {
  score = 0;
  scoreText.textContent = score;
  localStorage.setItem("score", score);
});

let score = 0;

const cookie = document.getElementById("cookieImage");
const scoreText = document.getElementById("score");

cookie.addEventListener("click", function () {
  score++;
  scoreText.textContent = score;
});

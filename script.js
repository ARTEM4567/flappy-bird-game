const sprite = new Image();
sprite.src = "flappy-bird-set.png";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const birdStartPosition = canvas.width / 10;
let isPlaying = false;
const gravity = 0.5;
const birdSpeed = 6.2;
const birdSize = [51, 36];
const jumpHeight = -11.5;

let frameCount = 0,
  highestScore = 0,
  birdFlight,
  birdYPosition,
  currentScore,
  pipesArray;
const pipeWidth = 78;
const pipeSpacing = 270;
const randomPipeYPosition = () =>
  Math.random() * (canvas.height - (pipeSpacing + pipeWidth) - pipeWidth) + pipeWidth;
const initializeGame = () => {
  document.getElementById("dialog").style.display = "block";
  currentScore = 0;
  birdFlight = jumpHeight;
  birdYPosition = canvas.height / 2 - birdSize[1] / 2;
  pipesArray = Array(3)
    .fill()
    .map((_, index) => [canvas.width + index * (pipeSpacing + pipeWidth), randomPipeYPosition()]);
};

const drawFrame = () => {
  frameCount++;
  ctx.drawImage(
    sprite,
    0,
    0,
    canvas.width,
    canvas.height,
    -((frameCount * (birdSpeed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    sprite,
    0,
    0,
    canvas.width,
    canvas.height,
    -(frameCount * (birdSpeed / 2)) % canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  if (isPlaying) {
    pipesArray.forEach((pipe) => {
      pipe[0] -= birdSpeed;
      ctx.drawImage(
        sprite,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );

      ctx.drawImage(
        sprite,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeSpacing,
        pipe[0],
        pipe[1] + pipeSpacing,
        pipeWidth,
        canvas.height - pipe[1] + pipeSpacing
      );

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        highestScore = Math.max(highestScore, currentScore);

        pipesArray = [
          ...pipesArray.slice(1),
          [pipesArray[pipesArray.length - 1][0] + pipeSpacing + pipeWidth, randomPipeYPosition()],
        ];
      }

      if (
        pipe[0] <= birdStartPosition + birdSize[0] &&
        pipe[0] + pipeWidth >= birdStartPosition &&
        (pipe[1] > birdYPosition || pipe[1] + pipeSpacing < birdYPosition + birdSize[1])
      ) {
        isPlaying = false;
        initializeGame();
      }
    });
  }

  if (isPlaying) {
    ctx.drawImage(
      sprite,
      432,
      Math.floor((frameCount % 9) / 3) * birdSize[1],
      ...birdSize,
      birdStartPosition,
      birdYPosition,
      ...birdSize
    );
    birdFlight += gravity;
    birdYPosition = Math.min(birdYPosition + birdFlight, canvas.height - birdSize[1]);
  } else {
    ctx.drawImage(
      sprite,
      432,
      Math.floor((frameCount % 9) / 3) * birdSize[1],
      ...birdSize,
      canvas.width / 2 - birdSize[0] / 2,
      birdYPosition,
      ...birdSize
    );
    birdYPosition = canvas.height / 2 - birdSize[1] / 2;
  }

  document.getElementById("bestScore").innerHTML = `Best : ${highestScore}`;
  document.getElementById("currentScore").innerHTML = `Current : ${currentScore}`;

  window.requestAnimationFrame(drawFrame);
};

initializeGame();
sprite.onload = drawFrame;
document.getElementById("startButton").addEventListener("click", () => {
  isPlaying = true;
  document.getElementById("dialog").style.display = "none";
});
window.onclick = () => (birdFlight = jumpHeight);

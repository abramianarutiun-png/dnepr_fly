const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
let gameOver = false;

// Bird object
const bird = {
  x: 50,
  y: 150,
  width: 34,
  height: 26,
  gravity: 0.25,
  jump: 4.6,
  velocity: 0,
  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  flap() {
    this.velocity = -this.jump;
  },
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if(this.y + this.height >= canvas.height || this.y <= 0) {
      gameOver = true;
    }
  }
};

// Pipes
const pipes = [];
const pipeWidth = 50;
const pipeGap = 120;

function spawnPipe() {
  let topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 20;
  pipes.push({x: canvas.width, top: topHeight, bottom: canvas.height - topHeight - pipeGap});
}

// Controls
canvas.addEventListener("click", () => {
  if(!gameOver) bird.flap();
  else resetGame();
});

// Game loop
function update() {
  bird.update();

  // Pipes
  if(frames % 100 === 0) spawnPipe();
  pipes.forEach(p => p.x -= 2);

  // Collision
  pipes.forEach(p => {
    if(bird.x + bird.width > p.x && bird.x < p.x + pipeWidth &&
       (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)) {
      gameOver = true;
    }
  });

  // Remove offscreen pipes
  while(pipes.length && pipes[0].x + pipeWidth < 0) pipes.shift();
}

function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bird.draw();

  ctx.fillStyle = "green";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, pipeWidth, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, pipeWidth, p.bottom);
  });

  if(gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", 70, canvas.height/2);
  }
}

function loop() {
  update();
  draw();
  frames++;
  if(!gameOver) requestAnimationFrame(loop);
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  gameOver = false;
  frames = 0;
  loop();
}

// Start the game
loop();


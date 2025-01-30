class HelicopterGame {
  constructor() {
    this.HelicopterCon = document.getElementById("heliContainer");
    this.heliHeight = this.HelicopterCon.offsetTop;
    this.obstaclesCon = document.getElementById("obstacle-container");
    this.wings = document.getElementById("wings");
    this.sound = document.getElementById("sound");
    this.gameOverSound = document.getElementById("gameOver");
    this.startPopup = document.getElementById("start-popup");
    this.gameOverPopup = document.getElementById("game-over-popup");
    this.startButton = document.getElementById("start-button");
    this.restartButton = document.getElementById("restart-button");
    this.scoreDisplay = document.getElementById("score");
    this.collectPointsSound = document.getElementById("collectPoints");

    this.obstacles = [];
    this.gravityInterval = null;
    this.obstacleInterval = null;
    this.gameOver = false;
    this.rotatingSpeed = 0;
    this.obstacleSpeed = 3;
    this.minGap = 320;
    this.maxGap = 450;
    this.score = 0;
    this.gameStarted = false;

    this.eventListeners();
  }

  eventListeners() {
    // added event listerners and assing methods
    this.startButton.addEventListener("click", () => this.startGame());
    this.restartButton.addEventListener("click", () => this.restartGame());
    window.onkeyup = () => this.moveHelicopter();
    window.onclick = () => this.moveHelicopter();
  }

  startGame() {
    // start the game
    this.startPopup.style.display = "none";
    this.gameStarted = true;
    this.init();
  }

  restartGame() {
    // restart logic and reset the values
    this.gameOverPopup.style.display = "none";
    clearInterval(this.gravityInterval);
    clearInterval(this.obstacleInterval);

    this.obstacles.forEach((obs) => obs.remove());
    this.obstacles = [];

    this.HelicopterCon.style.bottom = `50%`;
    this.gameOver = false;
    this.rotatingSpeed = 0;
    this.score = 0;
    this.updateScoreDisplay();
    this.gameStarted = true;

    this.init();
  }

  init() {
    // initializing methods
    this.gravity();
    this.moveWings();
    this.createObstacles();
    this.moveObstacles();
    this.checkCollision();
    this.playSound();
  }

  gravity() {
    // moving helicopter body position down on every 30ms
    this.gravityInterval = setInterval(() => {
      if (this.gameOver) return;
      if (this.heliHeight > 0) {
        this.heliHeight -= 5;
        this.HelicopterCon.style.bottom = `${this.heliHeight}px`;
      }
    }, 30);
  }

  moveHelicopter() {
    if (this.gameOver || !this.gameStarted) return;

    // moving helicopter body position up with every click or key on every 30ms
    const upInterval = setInterval(() => {
      if (this.heliHeight < document.body.offsetHeight - 100) {
        this.heliHeight += 5;
        this.HelicopterCon.style.bottom = `${this.heliHeight}px`;
      }
    }, 10);
    setTimeout(() => clearInterval(upInterval), 250);
  }

  createObstacles() {
    this.obstacleInterval = setInterval(() => {
      if (this.gameOver) return;

      // creating obstacles every 3 seconds
      this.createSingleObstacle();
    }, 3000);
  }

  createSingleObstacle() {
    // generate random gap size from min to max range
    const gapSize =
      Math.floor(Math.random() * (this.maxGap - this.minGap)) + this.minGap;
    // set random value max range window height total - gapsize and min val will be 50
    const topObstacleHeight =
      Math.floor(Math.random() * (window.innerHeight - gapSize - 200)) + 50;
    // set bottom obs height total height - gapSize - top obs height
    const bottomObstacleHeight =
      window.innerHeight - gapSize - topObstacleHeight;

    // Top Obstacles
    const topObstacle = document.createElement("div");
    topObstacle.className = "obstacle top-obstacle";
    topObstacle.style.height = `${topObstacleHeight}px`;
    topObstacle.style.left = `${window.innerWidth}px`;
    topObstacle.style.top = "0";

    // Bottom Obstacles
    const bottomObstacle = document.createElement("div");
    bottomObstacle.className = "obstacle bottom-obstacle";
    bottomObstacle.style.height = `${bottomObstacleHeight}px`;
    bottomObstacle.style.left = `${window.innerWidth}px`;
    bottomObstacle.style.bottom = "0";

    // Pushing Obstacles to array and append
    this.obstacles.push(topObstacle, bottomObstacle);
    this.obstaclesCon.appendChild(topObstacle);
    this.obstaclesCon.appendChild(bottomObstacle);
  }

  moveObstacles() {
    // moving obstacles to left on every 5ms
    setInterval(() => {
      if (this.gameOver) return;

      // running loop for obstacles array
      for (let i = 0; i < this.obstacles.length; i += 2) {
        let topObstacles = this.obstacles[i];
        let bottomObstacles = this.obstacles[i + 1];
        let currentLeft = parseInt(topObstacles.style.left, 10);

        // Deleting and resetting array when out of view
        if (currentLeft <= -50) {
          topObstacles.remove();
          bottomObstacles.remove();
          this.obstacles.splice(i, 2);

          // Score increment and method call for the DOM update
          this.score++;
          this.updateScoreDisplay();
        } else {
          // continue moving obs top and bottom to left
          topObstacles.style.left = `${currentLeft - this.obstacleSpeed}px`;
          bottomObstacles.style.left = `${currentLeft - this.obstacleSpeed}px`;
        }
      }
    }, 5);
  }

  checkCollision() {
    setInterval(() => {
      if (this.gameOver) return;

      // getting the size of Helicopter Body and position
      let heliBody = this.HelicopterCon.getBoundingClientRect();

      this.obstacles.forEach((obs) => {
        // getting the size of each obstacle and position
        let obsBody = obs.getBoundingClientRect();

        // checking if the Helicopter body and obstacle is touching
        if (
          heliBody.left < obsBody.right &&
          heliBody.right - 5 > obsBody.left &&
          heliBody.top - 5 < obsBody.bottom &&
          heliBody.bottom > obsBody.top
        ) {
          this.endGame();
        }
      });

      // checking if the Helicopter body is touching top or bottom of the body
      if (
        this.heliHeight <= 0 ||
        this.heliHeight >= document.body.offsetHeight - 110
      ) {
        this.endGame();
      }
    }, 30);
  }

  endGame() {
    // end game logic and resets
    this.gameOver = true;
    clearInterval(this.gravityInterval);
    clearInterval(this.obstacleInterval);
    this.wings.style.animationPlayState = "paused";
    this.gameOverPopup.style.display = "block";
    this.sound.pause();
    this.gameOverSound.play();
    this.score = 0;
    this.updateScoreDisplay();
  }

  moveWings() {
    // moving the helipcopter wings with rotate css and animation
    setInterval(() => {
      if (this.gameOver) return;
      this.rotatingSpeed += 360;
      this.wings.style.transform = `rotateY(${this.rotatingSpeed}deg)`;
    }, 30);
  }

  playSound() {
    // play main helicopter sound
    this.sound.style.display = "none";
    this.sound.play();
  }

  updateScoreDisplay() {
    // updating scoreboard in DOM
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = `Score: ${this.score}`;
      this.collectPointsSound.play();
    }
  }
}

// creating class instance
const game = new HelicopterGame();

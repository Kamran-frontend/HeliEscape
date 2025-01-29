class HelicopterGame {
  constructor() {
    this.HelicopterCon = document.getElementById("heliContainer");
    this.heliHeight = this.HelicopterCon.offsetTop;
    this.obstaclesCon = document.getElementById("obstacle-container");
    this.wings = document.getElementById("wings");
    this.sound = document.getElementById("sound");
    this.obstacles = [];
    this.gravityInterval = null;
    this.obstacleSpeed = 3;
    this.gameOver = false;
    this.rotatingSpeed = 0;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.gravity();
    this.moveWings();
    this.createObstacles();
    this.moveObstacles();
    this.checkCollision();
    this.playSound();
  }

  setupEventListeners() {
    window.onkeyup = (e) => this.move();
  }

  createObstacles() {
    for (let i = 0; i < 50; i++) {
      const obs = document.createElement("div");
      obs.className = "obstacle";
      obs.style.height = `${Math.floor(Math.random() * 300) + 100}px`;
      obs.style.left = `${Math.random() * 2000 + 100}px`;
      this.obstacles.push(obs);
      this.obstaclesCon.appendChild(obs);
    }
  }

  moveObstacles() {
    setInterval(() => {
      if (this.gameOver) {
        return;
      }
      this.obstacles.forEach((obs) => {
        let currentLeft = parseInt(obs.style.left, 10);
        if (currentLeft <= -50) {
          obs.style.left = `${window.innerWidth + Math.random() * 200}px`;
          obs.style.height = `${Math.floor(Math.random() * 300) + 100}px`;
        } else {
          obs.style.left = `${currentLeft - this.obstacleSpeed}px`;
        }
      });
    }, 30);
  }

  gravity() {
    this.gravityInterval = setInterval(() => {
      if (this.gameOver) {
        return;
      }
      if (this.heliHeight > 0) {
        this.heliHeight -= 5;
        this.HelicopterCon.style.bottom = `${this.heliHeight}px`;
      }
    }, 30);
  }

  move() {
    if (this.gameOver) {
      return;
    }
    const upInterval = setInterval(() => {
      if (this.heliHeight < document.body.offsetHeight - 100) {
        this.heliHeight += 5;
        this.HelicopterCon.style.bottom = `${this.heliHeight}px`;
      }
    }, 10);
    setTimeout(() => clearInterval(upInterval), 250);
  }

  checkCollision() {
    setInterval(() => {
      if (this.gameOver) {
        return;
      }

      let heliBody = this.HelicopterCon.getBoundingClientRect();

      this.obstacles.forEach((obs) => {
        let obsBody = obs.getBoundingClientRect();

        if (
          heliBody.left < obsBody.right &&
          heliBody.right - 5 > obsBody.left &&
          heliBody.top < obsBody.bottom &&
          heliBody.bottom > obsBody.top
        ) {
          this.endGame();
        }
      });

      if (
        this.heliHeight <= 0 ||
        this.heliHeight >= document.body.offsetHeight - 110
      ) {
        this.endGame();
      }
    }, 30);
  }

  endGame() {
    this.gameOver = true;
    clearInterval(this.gravityInterval);
    this.wings.style.animationPlayState = "paused";
    this.sound.pause();
    console.log("Game Over!! Please refresh for new game!");
  }

  moveWings() {
    this.wingRotationInterval = setInterval(() => {
      if (this.gameOver) {
        return;
      }
      this.rotatingSpeed += 360;
      this.wings.style.transform = "rotateY(" + this.rotatingSpeed + "deg)";
    }, 50);
  }
  playSound() {
    this.sound.style.display = "none";
    this.sound.play();
  }
}

const game = new HelicopterGame();

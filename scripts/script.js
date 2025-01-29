class HelicopterGame {
  constructor() {
    this.HelicopterCon = document.getElementById("heliContainer");
    this.heliHeight = document.getElementById("heliContainer").offsetHeight;
    this.obstaclesCon = document.getElementById("obstacle-container");
    this.obstacles = [];
    this.grav = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.gravity();
    this.moveWings();
    this.createObstacles();
    // this.playSound();
  }

  setupEventListeners() {
    window.onload = () => this.changeObstacles();
    window.onkeyup = (e) => this.move(e);
  }

  createObstacles() {
    for (let i = 0; i <= 5; i++) {
      const obs = document.createElement("div");
      obs.className = "obstacle";
      obs.style.position = "absolute";
      obs.style.bottom = "0px";
      obs.style.height = `${Math.floor(Math.random() * (400 - 100))}px`;
      obs.style.width = "50px";
      obs.style.backgroundColor = "#0f2b46";
      this.obstacles.push(obs);
      this.obstaclesCon.appendChild(obs);
    }
  }

  changeObstacles() {
    this.obstacles.forEach((obs) => {
      obs.style.height = `${Math.floor(Math.random() * (400 - 100) + 100)}px`;
      obs.style.left = `${Math.floor(Math.random() * 2000) + 400}px`;
    });
  }

  gravity() {
    this.grav = setInterval(() => {
      if (this.heliHeight > 0) {
        this.heliHeight -= 5;
        this.HelicopterCon.style.bottom = `${this.heliHeight}px`;
      }
    }, 10);
  }

  move() {
    const getUp = setInterval(() => {
      if (this.heliHeight < document.body.offsetHeight - 100) {
        this.heliHeight += 5;
        this.HelicopterCon.style.bottom = `${this.heliHeight}px`;
        setTimeout(() => clearInterval(getUp), 250);
      }
    }, 10);
  }
  moveWings() {
    setInterval(function () {
      let rotatingSpeed = 0;
      rotatingSpeed = rotatingSpeed + 100;
      document.getElementById("wings").style.transform =
        "rotatey(" + rotatingSpeed + "deg)";
    }, 50);
  }
  playSound() {
    var ourAudio = document.createElement("audio");
    ourAudio.style.display = "none";
    ourAudio.src = "./sounds/helicopter.mp3";
    ourAudio.autoplay = true;
    document.body.appendChild(ourAudio);
  }
}

const game = new HelicopterGame();

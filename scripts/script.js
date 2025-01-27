// Moving Wings of Helicoptor
setInterval(function () {
  let rotatingSpeed = 0;
  rotatingSpeed = rotatingSpeed + 100;
  document.getElementById("wings").style.transform =
    "rotatey(" + rotatingSpeed + "deg)";
}, 50);

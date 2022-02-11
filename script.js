const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDsiplay = document.querySelector(".message-container");

// Fetch random API world
let wordle;
const getWordle = () => {
  fetch("http://localhost:8000/word")
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      wordle = json.toUpperCase();
    })
    .catch((err) => console.log(err));
};
getWordle();

// Variable
const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "⌫",
];

// Guess rows building
const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

//-------------------------------------------------------------------------------------------

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

//  Creating guessRow and guessTile

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "guessRow-" + guessRowIndex + "-tile-" + guessIndex
    );
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});

// Keyboard

keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

// Delete and Enter keyboard

const handleClick = (letter) => {
  console.log("clicked", letter);
  if (letter === "⌫") {
    deleteLetter();
    return;
  }
  if (letter === "ENTER") {
    console.log("check row");
    checkRow();
    return;
  }
  addLetter(letter);
};

// Input Letter on the screen

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute("data", letter);
    currentTile++;
    console.log("guessRows", guessRows);
  }
};

// Delete functionality
const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

// Enter functionality and check words
const checkRow = () => {
  if (currentTile == 5) {
    const guess = guessRows[currentRow].join("");
    console.log("guess", guess);
    if (currentTile > 4) {
      fetch(`http://colalhost:8000/check/?word=${guess}`)
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
        });
    }

    console.log("guess is " + guess, "worlde is " + wordle);
    flipTile();

    // Game Logic.
    // If the words is right, show magnificent display
    // If the words are wrong, change to the next row to start
    if (wordle == guess) {
      showMessage("Magnificent");
      startConfetti();
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 5) {
        isGameOver = false;
        showMessage("Game Over");
        return;
      }
      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

// Display message if you get right word and time functionality
const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageDsiplay.append(messageElement);
  setTimeout(() => messageDsiplay.removeChild(messageElement), 2000);
};

// CSS styling of Game Logic, index means right position
const flipTile = () => {
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;

  rowTiles.forEach((tile, index) => {
    const dataLetter = tile.getAttribute("data");

    setTimeout(() => {
      tile.classList.add("flip");
      if (dataLetter == wordle[index]) {
        tile.classList.add("green-overlay");
        addColortoKey(dataLetter, "green-overlay");
      } else if (wordle.includes(dataLetter)) {
        tile.classList.add("yellow-overlay");
        addColortoKey(dataLetter, "yello-overlay");
      } else {
        tile.classList.add("grey-overly");
        addColortoKey(dataLetter, "grey-overlay");
      }
    }, 500 * index);
  });

  //   let checkWordle = wordle;
  //   const guess = [];

  //   rowTiles.forEach((tile) => {
  //     guess.push({ letter: tile.getAttribute("data"), color: "grey-overlaly" });
  //   });

  //   guess.forEach((guess, index) => {
  //     if (guess.letter === wordle[index]) {
  //       guess.color = "green-overlay";
  //       checkWordle = checkWordle.replace(guess.letter, "");
  //     }
  //   });

  //   guess.forEach((guess) => {
  //     if (checkWordle.includes(guess.letter)) {
  //       guess.color = "yellow-overlay";
  //       checkRow = checkWordle.replace(guess.letter, "");
  //     }
  //   });

  //   rowTiles.forEach((tile, index) => {
  //     setTimeout(() => {
  //       tile.classList.add("flip");
  //       tile.classList.add(guess[index].color);
  //       addColortoKey(guess[index].letter, guess[index].color);
  //     }, 500 * index);
  //   });
  // });
};

// Styling keyboard with CSS
const addColortoKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

// Confetti.js - downloaded from https://www.cssscript.com/confetti-falling-animation/

var confetti = {
  maxCount: 100, //set max confetti count
  speed: 5, //set the particle animation speed
  frameInterval: 15, //the confetti animation frame interval in milliseconds
  alpha: 1.0, //the alpha opacity of the confetti (between 0 and 1, where 1 is opaque and 0 is invisible)
  gradient: false, //whether to use gradients for the confetti particles
  start: null, //call to start confetti animation (with optional timeout in milliseconds, and optional min and max random confetti count)
  stop: null, //call to stop adding confetti
  toggle: null, //call to start or stop the confetti animation depending on whether it's already running
  pause: null, //call to freeze confetti animation
  resume: null, //call to unfreeze confetti animation
  togglePause: null, //call to toggle whether the confetti animation is paused
  remove: null, //call to stop the confetti animation and remove all confetti immediately
  isPaused: null, //call and returns true or false depending on whether the confetti animation is paused
  isRunning: null, //call and returns true or false depending on whether the animation is running
};

confetti.start = startConfetti;
confetti.stop = stopConfetti;
confetti.toggle = toggleConfetti;
confetti.pause = pauseConfetti;
confetti.resume = resumeConfetti;
confetti.togglePause = toggleConfettiPause;
confetti.isPaused = isConfettiPaused;
confetti.remove = removeConfetti;
confetti.isRunning = isConfettiRunning;
var supportsAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame;
var colors = [
  "rgba(30,144,255,",
  "rgba(107,142,35,",
  "rgba(255,215,0,",
  "rgba(255,192,203,",
  "rgba(106,90,205,",
  "rgba(173,216,230,",
  "rgba(238,130,238,",
  "rgba(152,251,152,",
  "rgba(70,130,180,",
  "rgba(244,164,96,",
  "rgba(210,105,30,",
  "rgba(220,20,60,",
];
var streamingConfetti = false;
var animationTimer = null;
var pause = false;
var lastFrameTime = Date.now();
var particles = [];
var waveAngle = 0;
var context = null;

function resetParticle(particle, width, height) {
  particle.color =
    colors[(Math.random() * colors.length) | 0] + (confetti.alpha + ")");
  particle.color2 =
    colors[(Math.random() * colors.length) | 0] + (confetti.alpha + ")");
  particle.x = Math.random() * width;
  particle.y = Math.random() * height - height;
  particle.diameter = Math.random() * 10 + 5;
  particle.tilt = Math.random() * 10 - 10;
  particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
  particle.tiltAngle = Math.random() * Math.PI;
  return particle;
}

function toggleConfettiPause() {
  if (pause) resumeConfetti();
  else pauseConfetti();
}

function isConfettiPaused() {
  return pause;
}

function pauseConfetti() {
  pause = true;
}

function resumeConfetti() {
  pause = false;
  runAnimation();
}

function runAnimation() {
  if (pause) return;
  else if (particles.length === 0) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    animationTimer = null;
  } else {
    var now = Date.now();
    var delta = now - lastFrameTime;
    if (!supportsAnimationFrame || delta > confetti.frameInterval) {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      updateParticles();
      drawParticles(context);
      lastFrameTime = now - (delta % confetti.frameInterval);
    }
    animationTimer = requestAnimationFrame(runAnimation);
  }
}

function startConfetti(timeout, min, max) {
  var width = window.innerWidth;
  var height = window.innerHeight;
  window.requestAnimationFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, confetti.frameInterval);
      }
    );
  })();
  var canvas = document.getElementById("confetti-canvas");
  if (canvas === null) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "confetti-canvas");
    canvas.setAttribute(
      "style",
      "display:block;z-index:999999;pointer-events:none;position:fixed;top:0"
    );
    document.body.prepend(canvas);
    canvas.width = width;
    canvas.height = height;
    window.addEventListener(
      "resize",
      function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      },
      true
    );
    context = canvas.getContext("2d");
  } else if (context === null) context = canvas.getContext("2d");
  var count = confetti.maxCount;
  if (min) {
    if (max) {
      if (min == max) count = particles.length + max;
      else {
        if (min > max) {
          var temp = min;
          min = max;
          max = temp;
        }
        count = particles.length + ((Math.random() * (max - min) + min) | 0);
      }
    } else count = particles.length + min;
  } else if (max) count = particles.length + max;
  while (particles.length < count)
    particles.push(resetParticle({}, width, height));
  streamingConfetti = true;
  pause = false;
  runAnimation();
  if (timeout) {
    window.setTimeout(stopConfetti, timeout);
  }
}

function stopConfetti() {
  streamingConfetti = false;
}

function removeConfetti() {
  stop();
  pause = false;
  particles = [];
}

function toggleConfetti() {
  if (streamingConfetti) stopConfetti();
  else startConfetti();
}

function isConfettiRunning() {
  return streamingConfetti;
}

function drawParticles(context) {
  var particle;
  var x, y, x2, y2;
  for (var i = 0; i < particles.length; i++) {
    particle = particles[i];
    context.beginPath();
    context.lineWidth = particle.diameter;
    x2 = particle.x + particle.tilt;
    x = x2 + particle.diameter / 2;
    y2 = particle.y + particle.tilt + particle.diameter / 2;
    if (confetti.gradient) {
      var gradient = context.createLinearGradient(x, particle.y, x2, y2);
      gradient.addColorStop("0", particle.color);
      gradient.addColorStop("1.0", particle.color2);
      context.strokeStyle = gradient;
    } else context.strokeStyle = particle.color;
    context.moveTo(x, particle.y);
    context.lineTo(x2, y2);
    context.stroke();
  }
}

function updateParticles() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var particle;
  waveAngle += 0.01;
  for (var i = 0; i < particles.length; i++) {
    particle = particles[i];
    if (!streamingConfetti && particle.y < -15) particle.y = height + 100;
    else {
      particle.tiltAngle += particle.tiltAngleIncrement;
      particle.x += Math.sin(waveAngle) - 0.5;
      particle.y +=
        (Math.cos(waveAngle) + particle.diameter + confetti.speed) * 0.5;
      particle.tilt = Math.sin(particle.tiltAngle) * 15;
    }
    if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
      if (streamingConfetti && particles.length <= confetti.maxCount)
        resetParticle(particle, width, height);
      else {
        particles.splice(i, 1);
        i--;
      }
    }
  }
}

// ---------------------------------------------------------------------
const toggleSwitch = document.querySelector('input[type="checkbox"]');
const toggleIcon = document.getElementById("toggle-icon");
const textBox = document.getElementById("text-box");

// Dark Mode Styles
function darkMode() {
  toggleIcon.children[0].textContent = "Dark Mode";
  toggleIcon.children[1].classList.replace("fa-sun", "fa-moon");
}

// Light Mode Styles
function lightMode() {
  toggleIcon.children[0].textContent = "Light Mode";
  toggleIcon.children[1].classList.replace("fa-moon", "fa-sun");
}

// Switch Theme Dynamically
function switchTheme(event) {
  if (event.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    darkMode();
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    lightMode();
  }
}

// Event Listener
toggleSwitch.addEventListener("change", switchTheme);

// Check Local Storage For Theme
const currentTheme = localStorage.getItem("theme");
if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
    darkMode();
  }
}

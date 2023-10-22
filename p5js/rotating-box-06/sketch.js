let circles = 12;
let ringRotationSpeed = 5;
let resetDelayFrames = 400;
let globalNoiseOffset = 0;

const baseSpinSpeed = 0.0002;
const spinOffset = 0.0002;

let ringDissipation = [];
let ringDissipationRates = [];
let previousNoiseValues = [];
let lastActiveRing = -1;

let forcePlayTime = null;
let isAnimating = false;

function setup() {
  createCanvas(800, 800, WEBGL);
  background(0,0,0,0);
  noiseDetail(2, 0.65);

  for (let i = 0; i < circles; i++) {
    ringDissipation.push(0);
    ringDissipationRates.push(random(0.002, 0.007));
    previousNoiseValues.push(0.5);
  }

  canvas = document.querySelector('canvas');
  canvas.addEventListener("mouseover", function() {
    if (!forcePlayTime) {
      isAnimating = true;
      loop();
    }
  });

  canvas.addEventListener("mouseout", function() {
    if (!forcePlayTime || (forcePlayTime && millis() - forcePlayTime > 10000)) {
      isAnimating = false;
      noLoop();
    }
  });

  canvas.addEventListener("click", function() {
    if (forcePlayTime) {
      if (millis() - forcePlayTime < 10000) {
        forcePlayTime = null;
        isAnimating = false;
        noLoop();
      }
    } else {
      forcePlayTime = millis();
      isAnimating = true;
      loop();
    }
  });

  noLoop();
}

function draw() {
  background(0,0,0,0);
  setCameraAndPerspective();
  stroke(255);
  fill(0, 0, 0, 200);
  globalNoiseOffset += 0.02;

  let totalHeight = calculateTotalHeight();
  let currentHeight = 0;
  let activeRing = computeActiveRing();
  
  if (activeRing !== -1) {
    lastActiveRing = activeRing;
  }

  for (let i = 0; i < circles; i++) {
    renderRing(i, activeRing, currentHeight, totalHeight);
    if (i != circles - 1) {
      currentHeight += lerp(5, 1740, (i + 1) / (circles - 1));
    }
  }

  if (forcePlayTime && millis() - forcePlayTime > 10000) {
    forcePlayTime = null;
    if (!isMouseOverCanvas()) {
      isAnimating = false;
      noLoop();
    }
  }
}

function isMouseOverCanvas() {
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  return mouseX > canvasX && mouseX < canvasX + width && mouseY > canvasY && mouseY < canvasY + height;
}

function setCameraAndPerspective() {
  camera(0, -200, 0, 0, 0, 0, 0, 0, 1);
  perspective(radians(12), width / height, 0.1, 20000);
}

function calculateTotalHeight() {
  let height = 0;
  for (let i = 1; i < circles; i++) {
    height += lerp(-2000, 4000, i / (circles - 1));
  }
  return height;
}

function computeActiveRing() {
  let totalFrames = floor(frameCount / ringRotationSpeed);
  let cycleFrames = circles + resetDelayFrames / ringRotationSpeed;
  let adjustedFrame = totalFrames % cycleFrames;

  if (adjustedFrame < circles) {
    return circles - 1 - adjustedFrame;
  } else {
    return -1;
  }
}

function renderRing(i, activeRing, currentHeight, totalHeight) {
  push();

  if (i > activeRing) {
    ringDissipation[i] = max(ringDissipation[i] - ringDissipationRates[i], 0);
  } else if (i === activeRing) {
    ringDissipation[i] = 1;
  }

  translate(0, currentHeight - totalHeight / 2 + 10000);
  rotateX(PI / 2);
  let spinSpeed = baseSpinSpeed - i * spinOffset;
  rotateZ(-frameCount * spinSpeed);

  for (let j = 0; j < 56; j++) {
    renderCubeInRing(i, activeRing, j);
  }

  pop();
}

function renderCubeInRing(i, activeRing, j) {
  let angle = (TWO_PI / 56) * j;
  let x = 300 * cos(angle);
  let y = 300 * sin(angle);
  let targetNoiseValue;

  push();
  translate(x, y);

  if (i >= activeRing) {
    targetNoiseValue = noise(x * 0.01, y * 0.01, globalNoiseOffset);
  } else if (activeRing === -1 && i === lastActiveRing) {
    targetNoiseValue = noise(x * 0.01, y * 0.01, globalNoiseOffset);
  } else {
    targetNoiseValue = 0.5;
  }

  let noiseValue = lerp(previousNoiseValues[i], targetNoiseValue, 0.1);
  previousNoiseValues[i] = noiseValue;

  let noiseFactor = noiseValue * ringDissipation[i];
  let rotate_deg = map(noiseFactor, 0, 1, -TWO_PI, TWO_PI);

  rotateZ(PI / 2 + angle);
  rotateX(rotate_deg);
  box(32);

  pop();
}

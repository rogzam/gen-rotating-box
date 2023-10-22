let offsets = [];
let isAnimating = false;
let forcePlayTime = null;

function setup() {
  createCanvas(800, 800, WEBGL);
  background(0, 0, 0, 0);
  noiseDetail(2, 0.65);

  let circles = 9;
  for (let i = 0; i < circles; i++) {
    offsets.push(random(1000));
  }

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

  noLoop();
  drawScene();
}

function drawScene() {
  background(0, 0, 0, 0);
  stroke(255);
  fill(0, 0, 0, 200);
  rotateY(-frameCount * 0.006);

  let circles = 9;
  let spacing = 45;
  let totalHeight = (circles - 1) * spacing;
  let pointsPerCircle = 55;
  let circleRadius = 200;
  let cubeSize = 22;

  for (let i = 0; i < circles; i++) {
    push();
    translate(0, i * spacing - totalHeight / 2);
    rotateX(PI / 2);

    for (let j = 0; j < pointsPerCircle; j++) {
      let angle = (TWO_PI / pointsPerCircle) * j;
      let x = circleRadius * cos(angle);
      let y = circleRadius * sin(angle);

      push();
      translate(x, y);

      let noiseFactor = noise(
        x * 0.001,
        y * 0.01,
        frameCount * 0.02 + offsets[i]
      );
      let rotate_deg = map(noiseFactor, 0, 1, -TWO_PI, TWO_PI);

      rotateZ(PI / 2 + angle);
      rotateX(rotate_deg);
      box(cubeSize);
      pop();
    }
    pop();
  }
}

function draw() {
  drawScene();

  if (forcePlayTime) {
    let timeElapsed = millis() - forcePlayTime;

    if (timeElapsed > 10000) {
      forcePlayTime = null;
      if (!isMouseOverCanvas()) {
        isAnimating = false;
        noLoop();
      }
    }
  }
}

function isMouseOverCanvas() {
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  return mouseX > canvasX && mouseX < canvasX + width && mouseY > canvasY && mouseY < canvasY + height;
}

function mouseClicked() {
  if (forcePlayTime) {
    let timeElapsed = millis() - forcePlayTime;
    if (timeElapsed < 10000) {
      forcePlayTime = null;
      isAnimating = false;
      noLoop();
    }
  } else {
    forcePlayTime = millis();
    isAnimating = true;
    loop();
  }
}

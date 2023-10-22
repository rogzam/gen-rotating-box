let offsets = [];  // Offsets for noise in each circle

// Configuration for each circle
const circleRadii = [10,100,175,215,240,254,265,254,240,215,175,100,10];
const cubesPerCircle = [0,25,47,62,70,74,76,74,70,62,47,25,0];
const circles = 13;

let forcePlayTime = null;
let isAnimating = false;

function setup() {
  createCanvas(800, 800, WEBGL);
  background(0);
  noiseDetail(0.5, 0.2);

  // Initialize offsets for each circle
  for (let i = 0; i < circles; i++) {
    offsets.push(random(1000));
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
  stroke(255);
  fill(0,0,0,200);
  
  rotateY(-frameCount * 0.002);  // Global rotation

  const spacing = 45;  // Vertical spacing between circles
  const totalHeight = (circles - 1) * spacing;
  const cubeSize = 22;  // Cube dimensions

  // Drawing circles and cubes on them
  for (let i = 0; i < circles; i++) {
    push();
    translate(0, i * spacing - totalHeight / 2);
    rotateX(PI / 2);  // Set circle to horizontal orientation

    // Drawing cubes on the circumference of the circle
    for (let j = 0; j < cubesPerCircle[i]; j++) {
      let angle = TWO_PI / cubesPerCircle[i] * j;
      let x = circleRadii[i] * cos(angle);
      let y = circleRadii[i] * sin(angle);

      push();
      translate(x, y);
      
      // Adjust cube rotation based on noise
      let noiseFactor = noise(x * 0.01, y * 0.01, frameCount * 0.02 + offsets[i]);
      let rotate_deg = map(noiseFactor, 0, 1, -TWO_PI, TWO_PI);
      rotateZ(PI/2 + angle);  // Adjust cube to face the center
      rotateX(rotate_deg);
      box(cubeSize);

      pop();
    }

    pop();
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

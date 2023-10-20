// Parameters related to circle rotation and noise
let offsets = [];
let rotationSpeeds = [];
let rotationDirections = [];
let increasingSpeed = [];
const maxSpeed = 0.002;
const minSpeed = 0.0;
const speedIncrement = 0.000001;

let animationPaused = false;

function pauseAnimation() {
  noLoop();
  animationPaused = true;
  //print('paused')

}

function resumeAnimation() {
  loop();
  animationPaused = false;
  //print('running')
}

function mousePressed() {
  if (animationPaused) {
    resumeAnimation();
  } else {
    pauseAnimation();
  }
}

function checkVisibility() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                resumeAnimation();
            } else {
                pauseAnimation();
            }
        });
    }, options);

    observer.observe(document.querySelector('canvas'));
}

function setup() {
    createCanvas(800, 800, WEBGL);
    background(0,0,0,0);
    noiseDetail(0.5, 0.65);

    let circles = 9;
    for (let i = 0; i < circles; i++) {
        offsets.push(random(1000));
        rotationSpeeds.push(random(minSpeed, maxSpeed));
        rotationDirections.push(random() > 0.5 ? 1 : -1);
        increasingSpeed.push(true); // All circles start by increasing in speed
    }
  checkVisibility();
}

function draw() {
    background(0,0,0,0);
    stroke(255);
    fill(0,0,0,200);

    // Rotate entire canvas around the Y-axis
    //rotateY(-frameCount * 0.006);

    let circles = 9;
    let spacing = 45;
    let totalHeight = (circles - 1) * spacing;
    let pointsPerCircle = 55;
    let circleRadius = 200;
    let cubeSize = 22;

    // Iterate through each circle
    for (let i = 0; i < circles; i++) {
        push();

        // Rotate each circle individually
        rotateY(frameCount * rotationSpeeds[i] * rotationDirections[i]);

        // Adjust rotation speed and direction
        if (increasingSpeed[i]) {
            rotationSpeeds[i] += speedIncrement;
            if (rotationSpeeds[i] >= maxSpeed) {
                rotationSpeeds[i] = maxSpeed;
                increasingSpeed[i] = false;
            }
        } else {
            rotationSpeeds[i] -= speedIncrement;
            if (rotationSpeeds[i] <= minSpeed) {
                rotationSpeeds[i] = minSpeed;
                increasingSpeed[i] = true;
                rotationDirections[i] *= -1; // Change direction only when at minimum speed
            }
        }

        // Position circle and set to horizontal orientation
        translate(0, i * spacing - totalHeight / 2);
        rotateX(PI / 2);

        // Place cubes on the circumference of the circle
        for (let j = 0; j < pointsPerCircle; j++) {
            let angle = (TWO_PI / pointsPerCircle) * j;
            let x = circleRadius * cos(angle);
            let y = circleRadius * sin(angle);
            
            push();
            translate(x, y);

            // Adjust cube rotation based on noise
            let noiseFactor = noise(x * 0.01, y * 0.01, frameCount * 0.02 + offsets[i]);  
            let rotate_deg = map(noiseFactor, 0, 1, -TWO_PI, TWO_PI);
            
            rotateZ(PI / 2 + angle);
            rotateX(rotate_deg);
            
            box(cubeSize); // Draw the cube
            pop();
        }
        pop();
    }
}


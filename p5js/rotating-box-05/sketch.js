const maxSpeed = 0.001;
const minSpeed = 0.0;
const speedIncrement = 0.000001;

let offsets = [];
let rotationSpeeds = [];
let rotationDirections = [];
let increasingSpeed = [];
let rotateRings = true;

function setup() {
    createCanvas(800, 800, WEBGL);
    background(0, 0, 0, 0);
    noiseDetail(2, 0.65);

    const circles = 20;
    for (let i = 0; i < circles; i++) {
        offsets.push(random(1000));
        rotationSpeeds.push(random(minSpeed, maxSpeed));
        rotationDirections.push(random() > 0.5 ? 1 : -1);
        increasingSpeed.push(true);
    }
}

function draw() {
    background(0, 0, 0, 0);
    setCameraAndPerspective();
    
    stroke(255);
    fill(0, 0, 0, 200);

    const circles = 30;
    const startingSpacing = 15; 
    const endingSpacing = 1250;
    const pointsPerCircle = 56;
    const circleRadius = 300;
    const cubeSize = 32;
    const totalHeight = calculateTotalHeight(circles, startingSpacing, endingSpacing);

    let currentHeight = 0;

    for (let i = 0; i < circles; i++) {
        rotateAndDrawRing(circles, i, totalHeight, currentHeight, pointsPerCircle, circleRadius, cubeSize);
        if (i != circles - 1) currentHeight += lerp(startingSpacing, endingSpacing, (i + 1) / (circles - 1));
    }
}

function setCameraAndPerspective() {
    camera(0, -200, 0, 0, 0, 0, 0, 0, 1);
    perspective(radians(12), width / height, 0.1, 200000);
}

function calculateTotalHeight(circles, startingSpacing, endingSpacing) {
    let total = 0;
    for (let i = 1; i < circles; i++) {
        total += lerp(startingSpacing, endingSpacing, i / (circles - 1));
    }
    return total;
}

function rotateAndDrawRing(circles, i, totalHeight, currentHeight, pointsPerCircle, circleRadius, cubeSize) {
    push();

    if (rotateRings) {
        rotateY(frameCount * rotationSpeeds[i] * rotationDirections[i]);
        adjustRotation(i);
    }

    translate(0, currentHeight - totalHeight / 2 + 10000);
    rotateX(PI / 2);

    for (let j = 0; j < pointsPerCircle; j++) {
        drawCubeInRing(i, j, pointsPerCircle, circleRadius, cubeSize);
    }
    pop();
}

function adjustRotation(i) {
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
            rotationDirections[i] *= -1;
        }
    }
}

function drawCubeInRing(i, j, pointsPerCircle, circleRadius, cubeSize) {
    const angle = (TWO_PI / pointsPerCircle) * j;
    const x = circleRadius * cos(angle);
    const y = circleRadius * sin(angle);

    push();
    translate(x, y);
    
    const noiseFactor = noise(x * 0.01, y * 0.01, frameCount * 0.02 + offsets[i]);
    rotateCube(angle, noiseFactor, cubeSize);
    
    pop();
}

function rotateCube(angle, noiseFactor, cubeSize) {
    const rotate_deg = map(noiseFactor, 0, 1, -TWO_PI, TWO_PI);
    rotateZ(PI / 2 + angle);
    rotateX(rotate_deg);
    box(cubeSize);
}

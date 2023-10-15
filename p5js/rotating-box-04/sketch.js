const maxSpeed = 0.0010;
const minSpeed = 0.0;
const speedIncrement = 0.000001;

let offsets = [];
let rotationSpeeds = [];
let rotationDirections = [];
let increasingSpeed = [];
let rotateRings = true; 

function setup() {
    createCanvas(800, 800, WEBGL);
    background(0,0,0,0);
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
    camera(0, -200, 0, 0, 0, 0, 0, 0, 1);
    perspective(radians(12), width / height, 0.1, 20000);

    stroke(255);
    fill(0, 0, 0, 200);

    const circles = 20;
    const spacing = 650;
    const totalHeight = (circles - 1) * spacing;
    const pointsPerCircle = 56;
    const circleRadius = 300;
    const cubeSize = 32;

    for (let i = 0; i < circles; i++) {
        push();

        if (rotateRings) {
            rotateY(frameCount * rotationSpeeds[i] * rotationDirections[i]);
            adjustRotation(i);
        }

        translate(0, (i * spacing - totalHeight / 2) + 10000);
        rotateX(PI / 2);

        for (let j = 0; j < pointsPerCircle; j++) {
            let angle = TWO_PI / pointsPerCircle * j;
            let x = circleRadius * cos(angle);
            let y = circleRadius * sin(angle);

            push();
            translate(x, y);
            let noiseFactor = noise(x * 0.01, y * 0.01, frameCount * 0.02 + offsets[i]);
            rotateCube(angle, noiseFactor, cubeSize);
            pop();
        }
        pop();
    }
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

function rotateCube(angle, noiseFactor, cubeSize) {
    let rotate_deg = map(noiseFactor, 0, 1, -TWO_PI, TWO_PI);
    rotateZ(PI / 2 + angle);
    rotateX(rotate_deg);
    box(cubeSize);
}


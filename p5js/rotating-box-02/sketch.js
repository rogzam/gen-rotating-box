let offsets = [];
let rotationSpeeds = [];
let rotationDirections = [];
let increasingSpeed = [];
const maxSpeed = 0.001;
const minSpeed = 0.0;
const speedIncrement = 0.000001;

let isAnimating = false;
let forcePlayTime = null;

function setup() {
    createCanvas(800, 800, WEBGL);
    background(0,0,0,0);
    noiseDetail(0.5, 0.65);

    let circles = 9;
    for (let i = 0; i < circles; i++) {
        offsets.push(random(1000));
        rotationSpeeds.push(random(minSpeed, maxSpeed));
        rotationDirections.push(random() > 0.5 ? 1 : -1);
        increasingSpeed.push(true);
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
}

function draw() {
    background(0,0,0,0);
    stroke(255);
    fill(0,0,0,200);

    let circles = 9;
    let spacing = 45;
    let totalHeight = (circles - 1) * spacing;
    let pointsPerCircle = 55;
    let circleRadius = 200;
    let cubeSize = 22;

    for (let i = 0; i < circles; i++) {
        push();
        rotateY(frameCount * rotationSpeeds[i] * rotationDirections[i]);
        
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

        translate(0, i * spacing - totalHeight / 2);
        rotateX(PI / 2);

        for (let j = 0; j < pointsPerCircle; j++) {
            let angle = (TWO_PI / pointsPerCircle) * j;
            let x = circleRadius * cos(angle);
            let y = circleRadius * sin(angle);
            
            push();
            translate(x, y);
            let noiseFactor = noise(x * 0.01, y * 0.01, frameCount * 0.02 + offsets[i]);  
            let rotate_deg = map(noiseFactor, 0, 1, -TWO_PI, TWO_PI);
            
            rotateZ(PI / 2 + angle);
            rotateX(rotate_deg);
            
            box(cubeSize);
            pop();
        }
        pop();
    }

    if (forcePlayTime) {
        if (millis() - forcePlayTime > 10000) {
            forcePlayTime = null;
            if (!isMouseOverCanvas()) {
                isAnimating = false;
                noLoop();
            }
        }
    }
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

function isMouseOverCanvas() {
    let canvasX = (windowWidth - width) / 2;
    let canvasY = (windowHeight - height) / 2;
    return mouseX > canvasX && mouseX < canvasX + width && mouseY > canvasY && mouseY < canvasY + height;
}


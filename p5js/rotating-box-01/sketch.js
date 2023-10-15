// Offsets for noise in each circle
let offsets = [];

function setup() {
    // Initialize canvas with WEBGL renderer
    createCanvas(800, 800, WEBGL);
    background(0);
    
    // Set noise characteristics
    noiseDetail(2, 0.65);

    // Initialize offsets for each circle
    let circles = 9;
    for (let i = 0; i < circles; i++) {
        offsets.push(random(1000));
    }
}

function draw() {
    background(0,0,0,0);
    stroke(255);
    fill(0,0,0,200);
    
    // Rotate the entire canvas around the Y-axis
    rotateY(-frameCount * 0.006);

    // Parameters for the circle and cubes
    let circles = 9;
    let spacing = 45;
    let totalHeight = (circles - 1) * spacing;
    let pointsPerCircle = 55;
    let circleRadius = 200;
    let cubeSize = 22;

    // Drawing circles with cubes on them
    for (let i = 0; i < circles; i++) {
        push(); // Save current transformation state
        translate(0, i * spacing - totalHeight / 2);
        rotateX(PI / 2); // Rotate to horizontal orientation
        
        // Position cubes on the circumference of the circle
        for (let j = 0; j < pointsPerCircle; j++) {
            let angle = TWO_PI / pointsPerCircle * j;
            let x = circleRadius * cos(angle);
            let y = circleRadius * sin(angle);
            
            push(); // Save transformation for each cube
            translate(x, y); 
            
            // Adjust cube rotation based on noise
            let noiseFactor = noise(x * 0.001, y * 0.01, frameCount * 0.02 + offsets[i]);
            let rotate_deg = map(noiseFactor, 0, 1, -TWO_PI, TWO_PI);
            
            rotateZ(PI/2 + angle);
            rotateX(rotate_deg);
            
            box(cubeSize); // Draw the cube
            pop(); // Restore cube transformation
        }
        pop(); // Restore circle transformation
    }
}
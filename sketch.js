let minVal = -2.5;
let maxVal = 2.5;
let maxIterations = 100;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;

function setup() {
  createCanvas(800, 800);
  pixelDensity(1);
  noLoop(); // Draw once, then only redraw when necessary
  drawMandelbrot();
}

function drawMandelbrot() {
  loadPixels();
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = map(x, 0, width, minVal + offsetX, maxVal + offsetX) / zoom;
      let b = map(y, 0, height, minVal + offsetY, maxVal + offsetY) / zoom;
      
      let ca = a;
      let cb = b;
      
      let n = 0;
      
      while (n < maxIterations) {
        let aa = a * a - b * b;
        let bb = 2 * a * b;
        a = aa + ca;
        b = bb + cb;
        
        if (abs(a + b) > 16) {
          break;
        }
        
        n++;
      }
      
      let bright = map(n, 0, maxIterations, 0, 255);
      if (n === maxIterations) {
        bright = 0;
      }
      
      let pix = (x + y * width) * 4;
      pixels[pix + 0] = bright;
      pixels[pix + 1] = bright;
      pixels[pix + 2] = bright;
      pixels[pix + 3] = 255;
    }
  }
  
  updatePixels();
}

function mouseWheel(event) {
  let zoomFactor = 0.9;
  if (event.delta > 0) {
    zoom *= zoomFactor;
  } else {
    zoom /= zoomFactor;
  }
  drawMandelbrot();
}

function mousePressed() {
  isDragging = true;
  startX = mouseX;
  startY = mouseY;
}

function mouseDragged() {
  if (isDragging) {
    offsetX += (startX - mouseX) / width * (maxVal - minVal) / zoom;
    offsetY += (startY - mouseY) / height * (maxVal - minVal) / zoom;
    startX = mouseX;
    startY = mouseY;
    drawMandelbrot();
  }
}

function mouseReleased() {
  isDragging = false;
}
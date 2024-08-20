let minVal = -2.5;
let maxVal = 2.5;
let maxIterations = 100;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;
let touchZoomDistStart = 0;
let touchZooming = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawMandelbrot();
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

function touchStarted() {
  if (touches.length === 2) {
    touchZoomDistStart = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    touchZooming = true;
  } else if (touches.length === 1) {
    startX = touches[0].x;
    startY = touches[0].y;
    isDragging = true;
  }
}

function touchMoved() {
  if (touchZooming && touches.length === 2) {
    let currentDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    let zoomFactor = currentDist / touchZoomDistStart;
    zoom *= zoomFactor;
    touchZoomDistStart = currentDist;
    drawMandelbrot();
  } else if (isDragging && touches.length === 1) {
    offsetX += (startX - touches[0].x) / width * (maxVal - minVal) / zoom;
    offsetY += (startY - touches[0].y) / height * (maxVal - minVal) / zoom;
    startX = touches[0].x;
    startY = touches[0].y;
    drawMandelbrot();
  }
  return false; // Prevent default touch behavior
}

function touchEnded() {
  isDragging = false;
  touchZooming = false;
}
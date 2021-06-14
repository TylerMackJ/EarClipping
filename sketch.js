let points = [];
let triangulating = false;
let reseting = false;

let backgroundColor;

function setup() {
  createCanvas(windowWidth, windowHeight);

  backgroundColor = color(75, 74, 103);

  background(backgroundColor);

  createButton("Triangulate").position(0, 0).mousePressed(triangulate);
  createButton("Reset").position(0, 25).mousePressed(reset);

  noLoop();
}

function draw() {}

function mouseClicked() {
  if (!triangulating) {
    // Check for no overlapping lines
    let x = mouseX;
    let y = mouseY;

    let goodLine = true;

    if (points.length > 2) {
      for (let i = 0; i < points.length - 2; i++) {
        if (
          intersect([x, y], points[points.length - 1], points[i], points[i + 1])
        ) {
          goodLine = false;
          break;
        }
      }
    }

    if (goodLine) {
      fill(color(0));
      stroke(color(0));
      circle(x, y, 5);
      if (points.length != 0) {
        line(x, y, points[points.length - 1][0], points[points.length - 1][1]);
      }
      points.push([x, y]);
    }
  }

  if (reseting) {
    points = [];
    reseting = false;
  }

  return false;
}

function triangulate() {
  let goodLine = true;

  if (points.length > 2) {
    for (let i = 1; i < points.length - 2; i++) {
      if (
        intersect(
          points[0],
          points[points.length - 1],
          points[i],
          points[i + 1]
        )
      ) {
        goodLine = false;
        break;
      }
    }
  }

  if (goodLine) {
    if (points.length > 2) {
      triangulating = true;
      line(
        points[0][0],
        points[0][1],
        points[points.length - 1][0],
        points[points.length - 1][1]
      );
      earClip();
    }
  }
}

function reset() {
  reseting = true;
  triangulating = false;
  points = [];
  background(backgroundColor);
}

function earClip() {
  colorMode(HSB);
  while (points.length > 3) {
    for (let i = 0; i < points.length - 3; i++) {
      // Testing triangle is i, i+1, i+2
      let goodTriangle = true;

      // Test if line i->i+2 is not intersecting any other lines
      for (let j = 0; j < points.length - 1; j++) {
        if (i != j && i != j + 1 && i + 1 != j && i + 1 != j + 1 && i + 2 != j && i + 2 != j + 1) {
          if(intersect(points[i], points[i + 2], points[j], points [j + 1])) {
            goodTriangle = false;
          }
        }
      }

      // Test if the center of of the triangle is inside the polygon
      let center = [(points[i][0] + points[1 + 1][0] + points[i + 2][0]) / 3, (points[i][1] + points[1 + 1][1] + points[i + 2][1]) / 3]
      let count = 0;
      for (let j = 0; j < points.length - 1; j++) {
        if (intersect(center, [Number.MAX_VALUE, center[1]], points[j], points[j + 1])) {
          count++;
        }
      }
      if (count % 2 == 0) {
        goodTriangle = false;
      }

      if (goodTriangle) {
        fill(color(360 * Math.random(), 50, 90));

        triangle(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], points[i + 2][0], points[i + 2][1]);
        points.splice(i + 1, 1);
      }
    }
  }
  fill(color(360 * Math.random(), 50, 90));
  triangle(points[0][0], points[0][1], points[1][0], points[1][1], points[2][0], points[2][1]);
  colorMode(RGB);
}
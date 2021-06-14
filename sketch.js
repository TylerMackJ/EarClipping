let points = [];
let triangulating = false;
let reseting = false;

let backgroundColor;

function setup() {
  createCanvas(windowWidth, windowHeight);

  backgroundColor = color(75, 74, 103);

  background(backgroundColor);

  createButton("Triangulate").position(0, 0).size(100, 25).mousePressed(triangulate);
  createButton("Reset").position(0, 25).size(100, 25).mousePressed(reset);
  noLoop();
}

function mouseReleased() {
  addPoint();
}

function touchEnded() {
  addPoint();
}

function addPoint() {
  let x = mouseX;
  let y = mouseY;
  if (!triangulating && !(x <= 100 && y <= 50)) {
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
  let fullPoly = [...points];
  while (points.length > 3) {
    for (let i = 0; i < points.length; i++) {
      let p = [i, (i + 1) % points.length, (i + 2) % points.length];
      // Testing triangle is i, i+1, i+2
      let goodTriangle = true;

      // Test if the center of of the triangle is inside the polygon
      let center = [(points[p[0]][0] + points[p[1]][0] + points[p[2]][0]) / 3, (points[p[0]][1] + points[p[1]][1] + points[p[2]][1]) / 3]
      let count = 0;
      for (let j = 0; j < fullPoly.length; j++) {
        if (intersect(center, [Number.MAX_VALUE, center[1]], fullPoly[j], fullPoly[(j + 1) % fullPoly.length])) {
          count++;
        }
      }
      if (count % 2 == 0) {
        goodTriangle = false;
      }

      // Test if there are any points inside the triangle
      for (let j = 0; j < points.length; j++) {
        if (p[0] != j && p[1] != j && p[2] != j) {
          if (pointInTriangle(points[j], points[p[0]], points[p[1]], points[p[2]])) {
            goodTriangle = false;
            print("Point inside");
            break;
          }
        }
      }

      if (goodTriangle) {
        fill(color(360 * Math.random(), 50, 90));

        triangle(points[p[0]][0], points[p[0]][1], points[p[1]][0], points[p[1]][1], points[p[2]][0], points[p[2]][1]);
        points.splice(p[1], 1);
        print((p[1]) + " removed");
        break;
      }
    }
  }
  fill(color(360 * Math.random(), 50, 90));
  triangle(points[0][0], points[0][1], points[1][0], points[1][1], points[2][0], points[2][1]);
  colorMode(RGB);
}

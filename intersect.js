function onSegment(p, q, r) {
  if (
    q[0] <= Math.max(p[0], r[0]) &&
    q[0] >= Math.min(p[0], r[0]) &&
    q[1] <= Math.max(p[1], r[1]) &&
    q[1] >= Math.min(p[1], r[1])
  ) {
    return true;
  }
  return false;
}

function direction(p, q, r) {
  let val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);

  if (val == 0) {
    return 0;
  }

  return val > 0 ? 1 : 2;
}

function intersect(p1, q1, p2, q2) {
  let o1 = direction(p1, q1, p2);
  let o2 = direction(p1, q1, q2);
  let o3 = direction(p2, q2, p1);
  let o4 = direction(p2, q2, q1);

  if (o1 != o2 && o3 != o4) {
    return true;
  }

  if (o1 == 0 && onSegment(p1, p2, q1)) {
    return true;
  }
  if (o2 == 0 && onSegment(p1, q2, q1)) {
    return true;
  }
  if (o3 == 0 && onSegment(p2, p1, q2)) {
    return true;
  }
  if (o4 == 0 && onSegment(p2, q1, q2)) {
    return true;
  }

  return false;
}

function sign(p1, p2, p3) {
  return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
}

function pointInTriangle(pt, v1, v2, v3) {
  let d1 = sign(pt, v1, v2);
  let d2 = sign(pt, v2, v3);
  let d3 = sign(pt, v3, v1);

  let hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  let hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(hasNeg && hasPos);

}
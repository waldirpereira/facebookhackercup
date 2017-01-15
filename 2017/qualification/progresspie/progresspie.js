var fs = require('fs');
var lines = fs.readFileSync('progress_pie.txt').toString().split("\n");

var T = +lines[0];
var points = [];
var results = [];
var caseNum = 0;

for (var i = 1; i <= T; i++) {
  var arrPoint = lines[i].split(' ');
  results.push("Case #" + ++caseNum + ": " + checkPoint({
    P: +arrPoint[0],
    X: +arrPoint[1],
    Y: +arrPoint[2]
  }));
}

var file = fs.createWriteStream('output.txt');
var num = 0;
file.on('error', function(err) { /* error handling */ });
results.forEach(function(v) { file.write(v + ((++num < T) ? '\n' : '')); });
file.end();


/**
 * Calculates the angle (in degrees) between two vectors pointing outward from one center
 *
 * @param p0 first point with X and Y values
 * @param p1 second point with X and Y values
 * @param c center point with X and Y values
 */
function angleDegBetweenThreePoints(p0,p1,c) {
    var p0c = Math.sqrt(Math.pow(c.X-p0.X,2) + Math.pow(c.Y-p0.Y,2)); // p0->c (b)
    var p1c = Math.sqrt(Math.pow(c.X-p1.X,2) + Math.pow(c.Y-p1.Y,2)); // p1->c (a)
    var p0p1 = Math.sqrt(Math.pow(p1.X-p0.X,2) + Math.pow(p1.Y-p0.Y,2)); // p0->p1 (c)
    return (Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c)) * 180) / Math.PI;
}

/**
 * Check if a point is black or white
 *
 * @param point point with X and Y values
 */
function checkPoint(point) {
  var delta = 0.000001;

  //percentage zero means always white
  if (point.P === 0) {
      return "white";
  }
  var distanceFromCenter = Math.sqrt( (point.X - 50)*(point.X - 50) + (point.Y - 50)*(point.Y - 50) );

  //point is outside the circle
  if (distanceFromCenter > (50 + delta)) {
    return "white";
  }

  //now the point is inside the circle
  var progressAngleDeg = (point.P / 100.0) * 360.0;

  //angle between the vectors of (point, center) to progress pie start
  var angleDeg = angleDegBetweenThreePoints({X: 50, Y: 100}, point, {X: 50, Y: 50});
  if (point.X < 50)
    angleDeg = (180 - angleDeg) + 180;

  return (angleDeg <= (progressAngleDeg + delta)) ? "black" : "white";
}

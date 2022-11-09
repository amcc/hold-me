// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let textString = "hold me!";
let conf = 0.4;
let poseArms = [];
  let ratio = 480 / 640;

function setup() {
  createCanvas(windowWidth, windowWidth * ratio);
  video = createCapture(VIDEO);
  video.size(width, height);
  textFont("Recursive");

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select("#status").html(
    "Wave your arms about, you might need to stand back a bit"
  );
}

function draw() {
  image(video, 0, 0, width, height);
  background(255, 150);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  fill(0);
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    // console.log(poses[0])
    let leftWrist = pose.leftWrist;
    let rightWrist = pose.rightWrist;

    if (leftWrist.confidence > conf || rightWrist.confidence > conf) {
      poseArms[i] = {
        lx: leftWrist.x,
        ly: leftWrist.y,
        rx: rightWrist.x,
        ry: rightWrist.y,
      };
      let d = dist(
        poseArms[i].lx,
        poseArms[i].ly,
        poseArms[i].rx,
        poseArms[i].ry
      );

      let textScaler = (d / textString.length) * 2;

      push()
      noStroke();
      translate(poseArms[i].rx, poseArms[i].ry);
      let a = atan2(
        poseArms[i].ly - poseArms[i].ry,
        poseArms[i].lx - poseArms[i].rx
      );
      rotate(a);
      textSize(textScaler);
      text(textString, 0, 0);
      pop()
      // stroke(255,0,0)
      // strokeWeight(10)
      // point(poseArms[i].lx,poseArms[i].ly)
      // point(poseArms[i].rx,poseArms[i].ry)
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowWidth * ratio);
  video.size(width, height);
}

var scene = new THREE.Scene();
var WIDTH = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    HEIGHT = (window.innerHeight > 0) ? window.innerHeight : screen.height;
var camera = new THREE.PerspectiveCamera( 50, WIDTH/HEIGHT, 0.1, 1000 );
var origin = new THREE.Vector3(0, 0, 0);
camera.position.set(5, 5, 30);
camera.zoom = WIDTH / HEIGHT / 1.3;
var maxCameraX = 20;
var minCameraX = -20;
var maxCameraY = 20;
var minCameraY = -15;
var maxCameraZ = 50;
var minCameraZ = 25;
var speedCameraX = .004;
var speedCameraY = .004;
var speedCameraZ = .002;
camera.up = new THREE.Vector3(0,1,0);
camera.lookAt(origin);
camera.updateProjectionMatrix();

window.addEventListener('resize', function() {
  var WIDTH = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      HEIGHT = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.zoom = WIDTH / HEIGHT / 1.3;
  camera.updateProjectionMatrix();
});

var numbers = {};
var timeStr = getTime();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var light = new THREE.DirectionalLight( 0xffffff, 3, 100 );
light.position.set( -20, 20, 100 );
scene.add( light );

var light2 = new THREE.AmbientLight( 0x111111, 2 );
scene.add( light2 );

// instantiate a loader
var loader = new THREE.STLLoader();

// load a resource
var clockPiece;
loader.load(
  // resource URL
  '../assets/models/clock-piece.stl',
  // Function when resource is loaded
  function ( geometry ) {
    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00, specular: 0xffffff, shininess: 200 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.scale.set(.1, .1, .1);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(0, 0, 0);
    // mesh.castShadow = true;
    // mesh.receiveShadow = true;
    clockPiece = mesh;
    // console.log('clockPiece =', clockPiece);
    // scene.add( clockPiece );
    numbers['h0'] = [];
    numbers['h1'] = [];
    numbers['m0'] = [];
    numbers['m1'] = [];
    numbers['s0'] = [];
    numbers['s1'] = [];
    for(var i = 0; i <= 9; i++) {
      var h0 = getNumber(i);
      var h1 = getNumber(i);
      var m0 = getNumber(i);
      var m1 = getNumber(i);
      var s0 = getNumber(i);
      var s1 = getNumber(i);
      h0.position.set(-17, 0, 0);
      h1.position.set(-12, 0, 0);
      m0.position.set(-5, 0, 0);
      m1.position.set(0, 0, 0);
      s0.position.set(7, 0, 0);
      s1.position.set(12, 0, 0);
      if (i == timeStr['h0'] && i != 0) {
        h0.visible = true;
      } else {
        h0.visible = false;
      }
      if (i != timeStr['h1']) {
        h1.visible = false;
      } else {
        h1.visible = true;
      }
      if (i != timeStr['m0']) {
        m0.visible = false;
      } else {
        m0.visible = true;
      }
      if (i != timeStr['m1']) {
        m1.visible = false;
      } else {
        m1.visible = true;
      }
      if (i != timeStr['s0']) {
        s0.visible = false;
      } else {
        s0.visible = true;
      }
      if (i != timeStr['s1']) {
        s1.visible = false;
      } else {
        s1.visible = true;
      }
      numbers['h0'].push(h0);
      numbers['h1'].push(h1);
      numbers['m0'].push(m0);
      numbers['m1'].push(m1);
      numbers['s0'].push(s0);
      numbers['s1'].push(s1);
      scene.add(h1);
      scene.add(m0);
      scene.add(m1);
      scene.add(s0);
      scene.add(s1);
      scene.add(h0);
    }
    var doth1 = clockPiece.clone();
    doth1.scale.set(.1, .1, 1/25);
    doth1.position.set(-8.5, 1.75, 0);
    scene.add(doth1);

    var doth2 = clockPiece.clone();
    doth2.scale.set(.1, .1, 1/25);
    doth2.position.set(-8.5, -1.75, 0);
    scene.add(doth2);

    var dotm1 = clockPiece.clone();
    dotm1.scale.set(.1, .1, 1/25);
    dotm1.position.set(3.5, 1.75, 0);
    scene.add(dotm1);

    var dotm2 = clockPiece.clone();
    dotm2.scale.set(.1, .1, 1/25);
    dotm2.position.set(3.5, -1.75, 0);
    scene.add(dotm2);
  },
  function (progess) {},
  function (ex) {
    console.log(ex);
  }
);

var start = performance.now();
var rate = 60; // Hz
var end = 30000 + start; // ms
var lastFrameNumber;
var lastUpdate = start;

// @input: discrete counter
// @min: lower value
// @max: maximum value
function oscillate(input, min, max) {
  var range = max - min;
  return min + Math.abs(((input + range) % (range * 2)) - range);
}

function update(lastUpdate, dt) {
  camera.position.x = oscillate(speedCameraX * (lastUpdate + dt), minCameraX, maxCameraX);
  camera.position.y = oscillate(speedCameraY * (lastUpdate + dt), minCameraY, maxCameraY);
  // camera.position.z = oscillate(speedCameraZ * (lastUpdate + dt), minCameraZ, maxCameraZ);
  camera.lookAt(origin);
  var currentTime = new Date().getTime();
  timeStr = getTime(currentTime);
  var futureTimeStr = getTime(currentTime + 250);
  var previousTimeStr = getTime(currentTime - 250);
  if (clockPiece && numbers['h0']) {
    for (var i = 0; i < numbers['h0'].length; i++) {
      var scaleNum = (timeStr['ms'] >= 250 && timeStr['ms'] <= 750) ? 1.0 : Math.min(timeStr['ms'] + 1, 1000 - timeStr['ms']) / 250;
      if (i == timeStr['h0'] && i != 0) {
        numbers['h0'][i].visible = true;
        if (previousTimeStr['h0'] != futureTimeStr['h0']) {
          numbers['h0'][i].scale.set(scaleNum, scaleNum, scaleNum);
        } else {
          numbers['h0'][i].scale.set(1.0, 1.0, 1.0);
        }
      } else {
        numbers['h0'][i].visible = false;
      }
      if (i != timeStr['h1']) {
        numbers['h1'][i].visible = false;
      } else {
        numbers['h1'][i].visible = true;
        if (previousTimeStr['h1'] != futureTimeStr['h1']) {
          numbers['h1'][i].scale.set(scaleNum, scaleNum, scaleNum);
        } else {
          numbers['h1'][i].scale.set(1.0, 1.0, 1.0);
        }
      }
      if (i != timeStr['m0']) {
        numbers['m0'][i].visible = false;
      } else {
        numbers['m0'][i].visible = true;
        if (previousTimeStr['m0'] != futureTimeStr['m0']) {
          numbers['m0'][i].scale.set(scaleNum, scaleNum, scaleNum);
        } else {
          numbers['m0'][i].scale.set(1.0, 1.0, 1.0);
        }
      }
      if (i != timeStr['m1']) {
        numbers['m1'][i].visible = false;
      } else {
        numbers['m1'][i].visible = true;
        if (previousTimeStr['m1'] != futureTimeStr['m1']) {
          numbers['m1'][i].scale.set(scaleNum, scaleNum, scaleNum);
        } else {
          numbers['m1'][i].scale.set(1.0, 1.0, 1.0);
        }
      }
      if (i != timeStr['s0']) {
        numbers['s0'][i].visible = false;
      } else {
        numbers['s0'][i].visible = true;
        if (previousTimeStr['s0'] != futureTimeStr['s0']) {
          numbers['s0'][i].scale.set(scaleNum, scaleNum, scaleNum);
        } else {
          numbers['s0'][i].scale.set(1.0, 1.0, 1.0);
        }
      }
      if (i != timeStr['s1']) {
        numbers['s1'][i].visible = false;
      } else {
        numbers['s1'][i].visible = true;
        numbers['s1'][i].scale.set(scaleNum, scaleNum, scaleNum);
      }
    }
  }
}

function getTime(currentTimeMilliseconds = new Date().getTime()) {
  var date = new Date(currentTimeMilliseconds);
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  var ms = date.getMilliseconds();
  if (h > 12) { h -= 12; }
  if (h == 0) { h = 12; }
  var h0 = (h < 10) ? 0 : 1;
  var h1 = (h < 10) ? h : h - 10;
  var m0 = Math.floor(m / 10);
  var m1 = m % 10;
  var s0 = Math.floor(s / 10);
  var s1 = s % 10;
  return {
    'h0': h0,
    'h1': h1,
    'm0': m0,
    'm1': m1,
    's0': s0,
    's1': s1,
    'ms': ms,
  };
}

function getSection(section) {
  if (section == 'top') {
    var top = clockPiece.clone();
    top.rotation.y = Math.PI / 2;
    top.position.set(0, 3.5, 0);
    return top;
  } else if (section == 'mid') {
    var mid = clockPiece.clone();
    mid.rotation.y = Math.PI / 2;
    mid.position.set(0, 0, 0);
    return mid;
  } else if (section == 'bottom') {
    var bottom = clockPiece.clone();
    bottom.rotation.y = Math.PI / 2;
    bottom.position.set(0, -3.5, 0);
    return bottom;
  } else if (section == 'topRight') {
    var topRight = clockPiece.clone();
    topRight.position.set(1.75, 1.75, 0);
    return topRight;
  } else if (section == 'bottomRight') {
    var bottomRight = clockPiece.clone();
    bottomRight.position.set(1.75, -1.75, 0);
    return bottomRight;
  } else if (section == 'topLeft') {
    var topLeft = clockPiece.clone();
    topLeft.position.set(-1.75, 1.75, 0);
    return topLeft;
  } else if (section == 'bottomLeft') {
    var bottomLeft = clockPiece.clone();
    bottomLeft.position.set(-1.75, -1.75, 0);
    return bottomLeft;
  }
}

function getNumber(num) {
  var group = new THREE.Group();
  if (num == 0) {
    group.add(getSection('top'));
    group.add(getSection('bottom'));
    group.add(getSection('topRight'));
    group.add(getSection('topLeft'));
    group.add(getSection('bottomRight'));
    group.add(getSection('bottomLeft'));
  } else if (num == 1) {
    group.add(getSection('topRight'));
    group.add(getSection('bottomRight'));
  } else if (num == 2) {
    group.add(getSection('top'));
    group.add(getSection('mid'));
    group.add(getSection('bottom'));
    group.add(getSection('topRight'));
    group.add(getSection('bottomLeft'));
  } else if (num == 3) {
    group.add(getSection('top'));
    group.add(getSection('mid'));
    group.add(getSection('bottom'));
    group.add(getSection('topRight'));
    group.add(getSection('bottomRight'));
  } else if (num == 4) {
    group.add(getSection('mid'));
    group.add(getSection('topRight'));
    group.add(getSection('topLeft'));
    group.add(getSection('bottomRight'));
  } else if (num == 5) {
    group.add(getSection('top'));
    group.add(getSection('mid'));
    group.add(getSection('bottom'));
    group.add(getSection('topLeft'));
    group.add(getSection('bottomRight'));
  } else if (num == 6) {
    group.add(getSection('top'));
    group.add(getSection('mid'));
    group.add(getSection('bottom'));
    group.add(getSection('topLeft'));
    group.add(getSection('bottomRight'));
    group.add(getSection('bottomLeft'));
  } else if (num == 7) {
    group.add(getSection('top'));
    group.add(getSection('topRight'));
    group.add(getSection('bottomRight'));
  } else if (num == 8) {
    group.add(getSection('top'));
    group.add(getSection('mid'));
    group.add(getSection('bottom'));
    group.add(getSection('topRight'));
    group.add(getSection('topLeft'));
    group.add(getSection('bottomRight'));
    group.add(getSection('bottomLeft'));
  } else if (num == 9) {
    group.add(getSection('top'));
    group.add(getSection('mid'));
    group.add(getSection('bottom'));
    group.add(getSection('topRight'));
    group.add(getSection('topLeft'));
    group.add(getSection('bottomRight'));
  }
  return group;
}

function animate() {
  var elapsed = performance.now() - lastUpdate;
  update(lastUpdate, elapsed);
  lastUpdate += elapsed;
  // console.log(elapsed);
  // if (lastUpdate < end) {
  window.requestAnimationFrame(animate);
  // }
  var frameNumber = Math.round(lastUpdate/(1000/rate));
  if (frameNumber == lastFrameNumber)
    return;
  lastFrameNumber = frameNumber;
  // ... update the display based on frameNumber ...
  renderer.render(scene, camera);
}
window.requestAnimationFrame(animate);

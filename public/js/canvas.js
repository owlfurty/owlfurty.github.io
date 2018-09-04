// CanvasMap
var renderer, scene, camera, ww, wh, particles;

ww = window.innerWidth,
wh = window.innerHeight;

var centerVector = new THREE.Vector3(0, 0, 0);
var previousTime = 0;

var getImageData = function(image) {

  var canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  return ctx.getImageData(0, 0, image.width, image.height);
}

var drawTheMap = function() {

  var geometry = new THREE.Geometry();
  var material = new THREE.PointsMaterial({
    size: 1.5,
    color: 0x4FBAAE,
    sizeAttenuation: false
  });
  for (var y = 0, y2 = imagedata.height; y < y2; y += 2) {
    for (var x = 0, x2 = imagedata.width; x < x2; x += 2) {
      if (imagedata.data[(x * 4 + y * 4 * imagedata.width) + 3] > 1) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 1000 - 500;
        vertex.y = Math.random() * 1000 - 500;
        vertex.z = -Math.random() * 1500;

        vertex.destination = {
          x: x - imagedata.width / 2,
          y: -y + imagedata.height / 2.3,
          z: 0
        };

        vertex.speed = Math.random() / 23300 + 0.055;

        geometry.vertices.push(vertex);
      }
    }
  }
  particles = new THREE.Points(geometry, material);

  scene.add(particles);

  requestAnimationFrame(render);
};

var init = function() {
  THREE.ImageUtils.crossOrigin = '';
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("map"),
    antialias: true
  });
  renderer.setSize(ww, wh);
  renderer.setClearColor(0xffffff);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, ww / wh, 0.01, 10100);
  camera.position.set(-2200, 0, 450);
  camera.lookAt(centerVector);
  scene.add(camera);

  texture = THREE.ImageUtils.loadTexture("http://res.cloudinary.com/dxzwevsfs/image/upload/v1477906438/12074707751460308013world_map.svg.hi_wsiosa.png", undefined, function() {
    imagedata = getImageData(texture.image);
    drawTheMap();
  });
  window.addEventListener('resize', onResize, true);

};
var onResize = function(){
  ww = window.innerWidth;
  wh = window.innerHeight;
  renderer.setSize(ww, wh);
    camera.aspect = ww / wh;
    camera.updateProjectionMatrix();
};

var render = function(a) {

  requestAnimationFrame(render);

  for (var i = 0, j = particles.geometry.vertices.length; i < j; i++) {
    var particle = particles.geometry.vertices[i];
    particle.x += (particle.destination.x - particle.x) * particle.speed;
    particle.y += (particle.destination.y - particle.y) * particle.speed;
    particle.z += (particle.destination.z - particle.z) * particle.speed;
  }

  if(a-previousTime>200){
    var index = Math.floor(Math.random()*particles.geometry.vertices.length);
    var particle1 = particles.geometry.vertices[index];
    var particle2 = particles.geometry.vertices[particles.geometry.vertices.length-index];
    TweenMax.to(particle, Math.random()*1+1,{x:particle2.x, y:particle2.y});
    TweenMax.to(particle2, Math.random()*1+1,{x:particle1.x, y:particle1.y});
    previousTime = a;
  }

  particles.geometry.verticesNeedUpdate = true;
  camera.position.x = Math.sin(a / 4200) * 60;
  camera.lookAt(centerVector);

  renderer.render(scene, camera);
};

init();
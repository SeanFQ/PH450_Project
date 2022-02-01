// values declared
let scene, camera, renderer, cube;
// documentation for reference in index.html
let kikuchi = document.getElementById("ThreeDiv");
// default quaternion values
var quaternion = new THREE.Quaternion();
var q1 = 0;
var q2 = 0;
var q3 = 0;
var q4 = 1;

function init() {
    // sets scene and camera angle
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 90, 400 / 400, 0.0001, 10 );
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add(axesHelper);
  
    // begins rendering process, edges smoothed
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    kikuchi.appendChild(renderer.domElement);
  
    // cube defined
    const geometry = new THREE.BoxGeometry();
    const loader = new THREE.TextureLoader();
    const materials = [
      new THREE.MeshBasicMaterial({map: loader.load('./Model/1.png'), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: loader.load('./Model/2.png'), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: loader.load('./Model/3.png'), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: loader.load('./Model/4.png'), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: loader.load('./Model/5.png'), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: loader.load('./Model/6.png'), side: THREE.DoubleSide}),
    ];
    cube = new THREE.Mesh(geometry, materials);
  
    // generates cube
    scene.add(cube);

  
}

//calculates the width of the kikuchi band through Bragg's Law
function bandWidth(h,k,l) {
  const radius = 0.48;
  const a = 3.18e-10;
  const c = 5.166e-10;
  const n = 1;
  const beamV = 20;
  const lamda = 8.5885e-12;
  let d = a/(Math.sqrt(4/3*((h**2) + h*k + (k**2))+((a**2)/(c**2))*(l**2)))
  console.log(d)
  let BraggAngle = Math.asin((n*lamda)/(2*(d)));
  console.log((BraggAngle*180/Math.PI))
  let width = 2*radius*Math.tan(BraggAngle);
  console.log(width)
  return width;
  
}

function Bands() {

    // defines cylinder Material and radius
    const radius = 0.48;
    var cylMaterial100 = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide, transparent: true, opacity: 0.3});
    var cylMaterial110 = new THREE.MeshBasicMaterial({color: 0x00c400, side: THREE.DoubleSide, transparent: true, opacity: 0.3});
    var cylMaterial101 = new THREE.MeshBasicMaterial({color: 0x00d6c1, side: THREE.DoubleSide, transparent: true, opacity: 0.3});
    
    // cylinders defined, these are used to highlight Kikuchi band patterns

    
    //cylinders for 100 plane
    width = bandWidth(1,0,0);
    var cylGeometry = new THREE.CylinderGeometry(radius, radius, width, 30, 30, true);
    cylinder1001 = new THREE.Mesh(cylGeometry, cylMaterial100);
    cylinder1002 = new THREE.Mesh(cylGeometry, cylMaterial100);
    cylinder1002.rotation.z = Math.PI/3;
    cylinder1003 = new THREE.Mesh(cylGeometry, cylMaterial100);
    cylinder1003.rotation.z = Math.PI-(Math.PI/3);

    //cylinders for 110 plane
    width = bandWidth(1,1,0);
    var cylGeometry = new THREE.CylinderGeometry(radius, radius, width, 30, 30, true);
    cylinder1101 = new THREE.Mesh(cylGeometry, cylMaterial110);
    cylinder1101.rotation.z = Math.PI/2;
    cylinder1102 = new THREE.Mesh(cylGeometry, cylMaterial110);
    cylinder1102.rotation.z = Math.PI/6;
    cylinder1103 = new THREE.Mesh(cylGeometry, cylMaterial110);
    cylinder1103.rotation.z = Math.PI-(Math.PI/6);


    //clylinders for 101 plane
    width = bandWidth(1,0,1);
    var cylGeometry = new THREE.CylinderGeometry(radius, radius, width, 30, 30, true);
    cylinder1011 = new THREE.Mesh(cylGeometry, cylMaterial101);
    cylinder1011.rotation.y = Math.PI/6;
    cylinder1011.rotation.z = Math.PI-(Math.PI/3);
    cylinder1011.rotation.x = Math.PI/2;
    cylinder1012 = new THREE.Mesh(cylGeometry, cylMaterial101);
    cylinder1012.rotation.y = Math.PI/6;
    cylinder1012.rotation.z = Math.PI/3;
    cylinder1012.rotation.x = Math.PI/2;
    cylinder1013 = new THREE.Mesh(cylGeometry, cylMaterial101);
    cylinder1013.rotation.y = Math.PI-(Math.PI/6);
    cylinder1013.rotation.z = Math.PI/3;
    cylinder1013.rotation.x = Math.PI/2;
    cylinder1014 = new THREE.Mesh(cylGeometry, cylMaterial101);
    cylinder1014.rotation.y = Math.PI-(Math.PI/6);
    cylinder1014.rotation.z = Math.PI-(Math.PI/3);
    cylinder1014.rotation.x = Math.PI/2;
    cylinder1015 = new THREE.Mesh(cylGeometry, cylMaterial101);
    cylinder1015.rotation.z = Math.PI/3;
    cylinder1015.rotation.y = Math.PI/2;
    cylinder1015.rotation.x = Math.PI/2;
    cylinder1016 = new THREE.Mesh(cylGeometry, cylMaterial101);
    cylinder1016.rotation.z = Math.PI-(Math.PI/3);
    cylinder1016.rotation.y = Math.PI/2;
    cylinder1016.rotation.x = Math.PI/2;
    
    // z-axis position of camera, centre of cube at position 0
    camera.position.z = 0;
}

function addband100() {
  //Displays cylinders that highlight the kikuchi bands within the 100 plane
  scene.add(cylinder1001,cylinder1002,cylinder1003);
}

function addband110() {
  //Displays cylinders that highlight the kikuchi bands within the 100 plane
  scene.add(cylinder1101,cylinder1102,cylinder1103);
}

function addband101() {
  //Displays cylinders that highlight the kikuchi bands within the 100 plane
  scene.add(cylinder1011,cylinder1012,cylinder1013,cylinder1014,cylinder1015,cylinder1016);
}

function removeband100() {
  //Displays cylinders that highlight the kikuchi bands within the 100 plane
  scene.remove(cylinder1001,cylinder1002,cylinder1003);
}

function removeband110() {
  //Displays cylinders that highlight the kikuchi bands within the 100 plane
  scene.remove(cylinder1101,cylinder1102,cylinder1103);
}

function removeband101() {
  //Displays cylinders that highlight the kikuchi bands within the 100 plane
  scene.remove(cylinder1011,cylinder1012,cylinder1013,cylinder1014,cylinder1015,cylinder1016);
}

function animate() {
    // controls animation of cube
    requestAnimationFrame(animate);
    quaternion.set(q1,q2,q3,q4);
    quaternion.normalize();
    // camera rotation set by quaternion values
    camera.rotation.setFromQuaternion(quaternion);
    renderer.render(scene, camera);
  }

init();
animate();
Bands();
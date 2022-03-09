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

const x = new THREE.Vector3( 1, 0, 0 );
const y = new THREE.Vector3( 0, 1, 0 );
const z = new THREE.Vector3( 0, 0, 1 );

const radius = 0.48;
const a = 3.18e-10;
const c = 5.166e-10;
const colour = [0xFF0000,0x00FFFF,0xFFFF00,0x00FF00,0x800080,0xFFA500]
let counter = 0
let cylinderNames = []

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

    // z-axis position of camera, centre of cube at position 0
    camera.position.z = 0;

  
}

//calculates the width of the kikuchi band through Bragg's Law
function bandWidth(h,k,l) {
  const n = 1;
  const beamV = 20;
  const lamda = 8.5885e-12;
  let d = a/(Math.sqrt(4/3*((h**2) + h*k + (k**2))+((a**2)/(c**2))*(l**2)))
  let BraggAngle = Math.asin((n*lamda)/(2*(d)));
  let width = 2*radius*Math.tan(BraggAngle);
  return width;
  
}

function N2Cangle(h,k,l) {
  // calculates the angle between the normal of the plane and the c-axis
  let W = (3*(a**2))/(2*(c**2))*l;
  let angle = Math.acos(((c**2)*W)/(c*Math.sqrt(3*(a**2)*((h**2)+h*k+k**2)+(c**2)*(W**2))));
  return angle;
}

function N2Aangle(h,k,l) {
  // calculates the angle between the normal of the plane and the a-axis
  let W = (3*(a**2))/(2*(c**2))*l;
  let angle = Math.acos(((a**2)*(9*(h+k)/2))/3*a*(Math.sqrt(3*(a**2)*((h**2)+h*k+k**2)+(c**2)*(W**2))))
  return angle;
}

function Band101(h,k,l) {
  //Creates a band from an input by calculating positon
  let width = bandWidth(h,k,l);
  var cylGeometry = new THREE.CylinderGeometry(radius, radius, width, 30, 30, true);
  var cylMaterial = new THREE.MeshBasicMaterial({color: 0x00d6c1, side: THREE.DoubleSide, transparent: true, opacity: 0.3});
  for (let i = 0; i < 7; i++) {
    cylinder = new THREE.Mesh(cylGeometry, cylMaterial);
    cylinder.rotateOnWorldAxis(x,Math.PI/2+N2Cangle(h,k,l));
    cylinder.rotateOnWorldAxis(z,N2Aangle(h,k,l)+Math.PI*2*i/6);
    cylinder.name = i
    scene.add(cylinder);
  }
}

function BandCreate(h,k,l) {
// creating a function that displays any plane given to it
  let width = bandWidth(h,k,l);
  var cylGeometry = new THREE.CylinderGeometry(radius, radius, width, 30, 30, true);
  var cylMaterial = new THREE.MeshBasicMaterial({color: colour[counter], side: THREE.DoubleSide, transparent: true, opacity: 0.3});
  let N2C = N2Cangle(h,k,l)
  let N2A = N2Aangle(h,k,l)
  let iterations = Math.round(2*Math.PI/N2C)
  console.log(iterations)
  for (let i = 0; i < (iterations+1); i++) {
    cylinder = new THREE.Mesh(cylGeometry, cylMaterial);
    cylinder.rotateOnWorldAxis(x,Math.PI/2+N2C);
    cylinder.rotateOnWorldAxis(z,N2A+Math.PI*2*i/iterations);
    cylinder.name = [i,counter].join()
    cylinderNames.push(cylinder.name)
    scene.add(cylinder);
  }
  counter += 1
}

function Bands() {

    // defines cylinder Material and radius
    var cylMaterial100 = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide, transparent: true, opacity: 0.3});
    var cylMaterial110 = new THREE.MeshBasicMaterial({color: 0x00c400, side: THREE.DoubleSide, transparent: true, opacity: 0.3});
    
    // cylinders defined, these are used to highlight Kikuchi band patterns

    //cylinders for 100 plane
    width = bandWidth(1,0,0);
    var cylGeometry = new THREE.CylinderGeometry(radius, radius, width, 30, 30, true);
    cylinder1001 = new THREE.Mesh(cylGeometry, cylMaterial100);
    cylinder1001.rotation.z = Math.PI/2;
    cylinder1002 = new THREE.Mesh(cylGeometry, cylMaterial100);
    cylinder1002.rotation.z = Math.PI/6;
    cylinder1003 = new THREE.Mesh(cylGeometry, cylMaterial100);
    cylinder1003.rotation.z = Math.PI-(Math.PI/6);
    
    //cylinders for 110 plane
    width = bandWidth(1,1,0);
    var cylGeometry = new THREE.CylinderGeometry(radius, radius, width, 30, 30, true);
    cylinder1101 = new THREE.Mesh(cylGeometry, cylMaterial110);
    cylinder1102 = new THREE.Mesh(cylGeometry, cylMaterial110);
    cylinder1102.rotation.z = Math.PI/3;
    cylinder1103 = new THREE.Mesh(cylGeometry, cylMaterial110);
    cylinder1103.rotation.z = Math.PI-(Math.PI/3);
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
  Band101(1,0,1);
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
  for (let j = 0; j < 7 ;j++) {
    scene.remove(scene.getObjectByName(j));
    scene.remove(scene.getObjectByName(j));
  }
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

function locate(a,b){
  var str = b;
  if (str.slice(0,1)=="{") {
    var qarray = str.slice(1,str.length-1).split(" ");
    q1 = qarray[0];
    q2 = qarray[1];
    q3 = qarray[2];
    q4 = qarray[3];
  }
  animate();
}

init();
animate();
Bands();
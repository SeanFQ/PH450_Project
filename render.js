// values declared
let scene, camera, renderer, cube;
// documentation for reference in index.html
let kikuchi = document.getElementById("ThreeDiv");

// defining constants

// default quaternion values
var quaternion = new THREE.Quaternion();
var q1 = 0;
var q2 = 0;
var q3 = 0;
var q4 = 1;

//unit vectors
const x = new THREE.Vector3( 1, 0, 0 );
const y = new THREE.Vector3( 0, 1, 0 );
const z = new THREE.Vector3( 0, 0, 1 );

const radius = 0.48; //radius of the cylinders

// lattice vectors
const a = 3.18e-10;
const c = 5.166e-10;
//const W = (3*(a**2))/(4*(c**2));

const n = 1; // order of diffraction
const lightspeed = 299792458; //speed of light
const me = 9.1094897*10**-31; //mass of an electron
const e = 1.60217733*10**-19; //charge of an electron
const plancksconstant = 6.62607004*10**-34; //plancks constant
var beamV = 20000; // accelerating voltage of electron beam

// calculating the wavelength of the beam
var lamda = plancksconstant/(Math.sqrt(2*me*e*beamV*(1+(e/2*me*(lightspeed)**2)*beamV)));

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
      new THREE.MeshBasicMaterial({map: loader.load(`./Model/GaN/20keV/18090n90.png`), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: loader.load(`./Model/GaN/20keV/909090.png`), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: loader.load(`./Model/GaN/20keV/090180.png`), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: loader.load(`./Model/GaN/20keV/n90900.png`), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: loader.load(`./Model/GaN/20keV/18000.png`), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map: loader.load(`./Model/GaN/20keV/01800.png`), side: THREE.DoubleSide}),
    ];
    cube = new THREE.Mesh(geometry, materials);
  
    // generates cube
    scene.add(cube);

    // z-axis position of camera, centre of cube at position 0
    camera.position.z = 0;

}

function TextureChange() {
  scene.remove(cube)
  let CIF = document.getElementById("Cif").value;
  let AcceleratingVoltage = document.getElementById("EAV").value;
  let Texture = `${CIF}/${AcceleratingVoltage}keV`
  const geometry = new THREE.BoxGeometry();
  const loader = new THREE.TextureLoader();
  const materials = [
    new THREE.MeshBasicMaterial({map: loader.load(`./Model/${Texture}/18090n90.png`), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: loader.load(`./Model/${Texture}/909090.png`), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: loader.load(`./Model/${Texture}/090180.png`), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: loader.load(`./Model/${Texture}/n90900.png`), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: loader.load(`./Model/${Texture}/18000.png`), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: loader.load(`./Model/${Texture}/01800.png`), side: THREE.DoubleSide}),
  ];
  cube = new THREE.Mesh(geometry, materials);
  
  // generates cube
  scene.add(cube);
  Jmol.script(myJmol,`load ./Model/${CIF}.cif {445,665,-1}`)

}

//calculates the width of the kikuchi band through Bragg's Law
function bandWidth(h,k,l) {
  let AcceleratingVoltage = document.getElementById("EAV").value;
  var beamV = AcceleratingVoltage*1000;
  var lamda = plancksconstant/(Math.sqrt(2*me*e*beamV*(1+(e/2*me*(lightspeed)**2)*beamV)));
  let d = a/(Math.sqrt(4/3*((h**2) + h*k + (k**2))+((a**2)/(c**2))*(l**2)))
  let BraggAngle = Math.asin((n*lamda)/(2*(d)));
  let width = 2*radius*Math.tan(BraggAngle);
  return width;
}

function N2Aangle(h,k,i,l) {
  // calculates the angle between the normal of the plane and the direction of the a-axis [2,-1,-1,0]
  W = l*((3*a**2)/(2*c**2))*0 //when this term is multiplied by zero, the program works.
  const num = (a**2)*(3*(2*h-k)+(3/2)*(2*k-h)) // numerator of the equation
  const den = 3*a*Math.sqrt((3*(a**2)*((h**2)+h*k+(k**2)))+((c**2)*(W**2))) // denomenator of equation
  const angle = Math.acos(num/den); //Angle between normal and direction of A-axis [2,-1,-1,0]
  console.log("Normal to A axis:",angle);
  if (isNaN(angle)){
    return 0;
  }
  return angle;
}

function N2Cangle(h,k,i,l) {
  // calculates the angle between the normal of the plane and the direction of the c-axis [0,0,0,1]
  W = ((3*a**2)/(2*c**2))*l
  let angle = Math.acos((W*(c**2))/(c*Math.sqrt(3*(a**2)*((h**2)+h*k+(k**2))+(c**2)*(W**2))));
  console.log("Normal to C axis",angle);
  if (isNaN(angle)){
    return 0;
  }
  return angle;
}

//hammond the basics of crystallography and diffraction appendix 4 - angle between planes equation - suspect problems - didnt work

function HighlightBands(h,k,i,l) {
  //Creates a band from an input by calculating positon
  let width = bandWidth(h,k,l);
  let bandnumber = Number(Multiplicity(h,k,i));
  var cylGeometry = new THREE.CylinderGeometry(radius, radius, width, 30, 30, true);
  var cylMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide, transparent: true, opacity: 0.3});
  const N2A = N2Aangle(h,k,i,l)
  const N2C = N2Cangle(h,k,i,l)
  for (let count = 0; count < (bandnumber); count++) {
    cylinder = new THREE.Mesh(cylGeometry, cylMaterial);
    cylinder.rotateOnWorldAxis(x,Math.PI/2);
    cylinder.rotateOnWorldAxis(x,N2C);
    if (count>5){
      cylinder.rotateOnWorldAxis(z,-N2A-Math.PI*2*count/6)
    } else{
      cylinder.rotateOnWorldAxis(z,N2A+Math.PI*2*count/6)
    }
    cylinder.name = count
    scene.add(cylinder);
  }
}

function Multiplicity(h,k,i) {
  // caluclates the multiplicity - the number of bands that relate to a specified plane
  equivplanes = permutator([h,k,i]);
  m = equivplanes.length;
  //inverse of permutations added to same array
  for (let count = 0; count < m; count++){
    let negplane = [];
    plane = equivplanes[count];
    for (let ncount = 0; ncount < 3; ncount++){
      negplane[ncount] = plane[ncount]*-1
    }
    equivplanes.push(negplane)
  }
  // remove duplicates
  equivplanes = eliminateDuplicates(equivplanes)
  console.log(equivplanes)
  m = equivplanes.length
  return m;
}

function eliminateDuplicates(arr) {
  let i,
      len = arr.length,
      out = [],
      obj = {};
  for (i = 0; i < len; i++) {
    obj[arr[i]] = 0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

function permutator(inputArr) {
  var results = [];
  function permute(arr, memo) {
    var cur, memo = memo || [];
    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }
    return results;
  }

  return permute(inputArr);
}

function removebands() {
  //removes cylinders that highlight the kikuchi bands within the 101 plane
  for (let j = 0; j < 30 ;j++) {
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
  // relays the rotation information from the unit cell to the pattern by changing the quarternion values
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

function reset(){
  q1 = 0;
  q2 = 0;
  q3 = 0;
  q4 = 1;
  
  animate();
}


function SubmitVals() {
  Jmol.script(myJmol,'isosurface p4 delete')
  removebands();
  const HInputs = document.getElementById("HInput").value;
  const KInputs = document.getElementById("KInput").value;
  const IInputs = -(Number(HInputs)+Number(KInputs))
  document.getElementById('IInputs').innerHTML = IInputs;
  const LInputs = document.getElementById("LInput").value;
  Jmol.script(myJmol, `isosurface p4 hkl {${String(HInputs)} ${String(KInputs)} ${String(LInputs)}} boundbox;color isosurface red translucent`);
  HighlightBands(HInputs,KInputs,IInputs,LInputs);
}

init();
animate();
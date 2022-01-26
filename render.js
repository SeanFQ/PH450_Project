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

    // defines cylinder geometry, cyl_height defined through Bragg's Law
    var cyl_height = 0.02262;
    var cylGeometry = new THREE.CylinderGeometry(0.48, 0.48, cyl_height, 30, 30, true);
    var cylMaterial100 = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide, transparent: true, opacity: 0.3});
    var cylMaterial110 = new THREE.MeshBasicMaterial({color: 0x00c400, side: THREE.DoubleSide, transparent: true, opacity: 0.3});
    var cylMaterial101 = new THREE.MeshBasicMaterial({color: 0x00d6c1, side: THREE.DoubleSide, transparent: true, opacity: 0.3});
    
    // cylinders defined, these are used to highlight Kikuchi band patterns
    
    //cylinders for 100 plane
    cylinder1001 = new THREE.Mesh(cylGeometry, cylMaterial100);
    cylinder1002 = new THREE.Mesh(cylGeometry, cylMaterial100);
    cylinder1002.rotation.z = Math.PI/3;
    cylinder1003 = new THREE.Mesh(cylGeometry, cylMaterial100);
    cylinder1003.rotation.z = Math.PI-(Math.PI/3);

    //cylinders for 110 plane
    cylinder1101 = new THREE.Mesh(cylGeometry, cylMaterial110);
    cylinder1101.rotation.z = Math.PI/2;
    cylinder1102 = new THREE.Mesh(cylGeometry, cylMaterial110);
    cylinder1102.rotation.z = Math.PI/6;
    cylinder1103 = new THREE.Mesh(cylGeometry, cylMaterial110);
    cylinder1103.rotation.z = Math.PI-(Math.PI/6);

    //clylinders for 101 plane
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

    // generates cylinders
    //scene.add(cylinder1001,cylinder1002,cylinder1003);
    //scene.add(cylinder1101,cylinder1102,cylinder1103);
    scene.add(cylinder1011,cylinder1012,cylinder1013,cylinder1014);

    // z-axis position of camera, centre of cube at position 0
    camera.position.z = 0;
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
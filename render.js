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
    camera = new THREE.PerspectiveCamera( 60, 400 / 300, 0.0001, 10 );
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add(axesHelper);
  
    // begins rendering process, edges smoothed
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 300);
    kikuchi.appendChild(renderer.domElement);
  
    // cube defined
    const geometry = new THREE.BoxGeometry();
    const texture = new THREE.TextureLoader().load("123.png");
    const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
    cube = new THREE.Mesh(geometry, material);
  
    // generates cube
    scene.add(cube);
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
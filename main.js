import * as THREE from 'three';

const images = [
  'club.png',
  'A2_poster_blue.jpg',
  'poster1.png',
];

const titles = [
  'Club Paradiso',
  'Gentle Leash',
  'Club AI',
  'Effect of Spring, Giverny',
  'Mount Corcoran',
  'A Sunday on La Grande Jatte'
];

const description = [
  'Poster and USB design',
  'Poster and 3D graphics Design',
  'Poster Design and VJ for Club event'
];
const textureLoader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const rootNode = new THREE.Object3D();
scene.add(rootNode)

let count = 3;
for ( let i = 0; i< count; i++) {
  const texture = textureLoader.load(images[i]);
  texture.colorSpace = THREE.SRGBColorSpace;

  const baseNode = new THREE.Object3D();
  baseNode.rotation.y = i * (2 * Math.PI / count);
  rootNode.add(baseNode);

  const artwork = new THREE.Mesh(
    new THREE.BoxGeometry(2, 3, 0.1),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  artwork.position.z = -4;
  baseNode.add(artwork)
}

function animate() {
  rootNode.rotation.y += 0.005
	renderer.render( scene, camera );
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

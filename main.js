import * as THREE from 'three';
import { Reflector } from 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/objects/Reflector.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
const images = [
  '/public/club_paradiso_1.png',
  '/public/club_ai_2.png',
  '/public/gentle_leash_3.jpg',
  '/public/club_paradiso_4.png',
  '/public/club_ai_5.png',
  '/public/gentle_leash_6.jpg',
];

const titles = [
  'Club Paradiso',
  'Gentle Leash',
  'Club AI',
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

const leftArrowTexture = textureLoader.load('/public/left.png');
const rightArrowTexture = textureLoader.load('/public/right.png');

let count = 6;
for ( let i = 0; i< count; i++) {
  const texture = textureLoader.load(images[i]);
  console.log(`Loaded texture: ${images[i]}`, texture);
  texture.colorSpace = THREE.SRGBColorSpace;

  const baseNode = new THREE.Object3D();
  baseNode.rotation.y = i * (2 * Math.PI / count);
  rootNode.add(baseNode);

  const border = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 4.1, 0.09),
    new THREE.MeshStandardMaterial({ color: 0x202020 })
  );
  border.name = `Border_${i}`;
  border.position.z = -4;
  baseNode.add(border);

  const artwork = new THREE.Mesh(
    new THREE.BoxGeometry(3, 4, 0.1),
    new THREE.MeshStandardMaterial({ map: texture })
  );
  artwork.name = `Art_${i}`;
  artwork.position.z = -4;
  baseNode.add(artwork)

  const leftArrow = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.01),
    new THREE.MeshStandardMaterial({
      map: leftArrowTexture,
      transparent: true
     })
  );
  leftArrow.name = `LeftArrow`;
  leftArrow.position.set(-1.8, 0, -4);
  baseNode.add(leftArrow);

  const rightArrow = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.01),
    new THREE.MeshStandardMaterial({
      map: rightArrowTexture,
      transparent: true
     })
  );
  rightArrow.name = `RightArrow`;
  rightArrow.position.set(1.8, 0, -4);
  baseNode.add(rightArrow);
}


const spotlight = new THREE.SpotLight(0xffffff, 150.0, 10.0, 0.65, 0.5);
spotlight.position.set(0, 5, 0);
spotlight.target.position.set(0, 0.5, -5);
scene.add(spotlight);
scene.add(spotlight.target);

const mirror = new Reflector(
  new THREE.CircleGeometry(10),
  {
    color: 0x505050,
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight
  }
)
mirror.position.y = -2.1;
mirror.rotateX(-Math.PI / 2);
scene.add(mirror);

function rotateGallery(direction) {
  const deltaY = direction * (2 * Math.PI / count);

  new TWEEN.Tween(rootNode.rotation)
    .to({ y: rootNode.rotation.y + deltaY })
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();
}

function animate() {
  TWEEN.update();
	renderer.render( scene, camera );
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  mirror.getRenderTarget().setSize(
    window.innerWidth,
    window.innerHeight);
})

window.addEventListener('click', (ev) => {
  const raycaster = new THREE.Raycaster();

  const mouseNDC = new THREE.Vector2(
    (ev.clientX / window.innerWidth) * 2 - 1,
    -(ev.clientY / window.innerHeight) * 2 + 1,
  );

  raycaster.setFromCamera(mouseNDC, camera);

  const intersections = raycaster.intersectObject(rootNode, true);
  if (intersections.length > 0) {
    if (intersections[0].object.name === 'LeftArrow') {
      // console.log('Click on Left arrow');
      rotateGallery(-1);
    }
    if (intersections[0].object.name === 'RightArrow') {
      // console.log('Click on Right arrow');
      rotateGallery(1);
    }
  }
});

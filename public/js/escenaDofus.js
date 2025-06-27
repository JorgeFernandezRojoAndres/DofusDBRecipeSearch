// js/escenaDofus.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0); // Fondo transparente
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersected = false; // Estado de intersección

const container = document.getElementById('threeContainer');
renderer.setSize(container.clientWidth, 400);
container.appendChild(renderer.domElement);

// 🧩 Cargar 6 texturas diferentes (una por cara)
const loader = new THREE.TextureLoader();
const materiales = [
  new THREE.MeshBasicMaterial({ map: loader.load('images/cara1.jpg') }), // +X
  new THREE.MeshBasicMaterial({ map: loader.load('images/cara2.jpg') }), // -X
  new THREE.MeshBasicMaterial({ map: loader.load('images/cara3.jpg') }), // +Y
  new THREE.MeshBasicMaterial({ map: loader.load('images/cara4.jpg') }), // -Y
  new THREE.MeshBasicMaterial({ map: loader.load('images/cara5.jpg') }), // +Z
  new THREE.MeshBasicMaterial({ map: loader.load('images/cara6.jpg') })  // -Z
];

// 🎲 Cubo con diferentes caras
const geometry = new THREE.BoxGeometry(2, 2, 2); // ancho, alto, profundidad

const cube = new THREE.Mesh(geometry, materiales);
scene.add(cube);
// 🖊️ Bordes en negro
const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const wireframe = new THREE.LineSegments(edges, lineMaterial);
cube.add(wireframe);

// 📷 Cámara
camera.position.z = 3;

// 🔁 Animación
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Intersección con el mouse
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(cube);

  if (intersects.length > 0) {
    if (!intersected) {
      wireframe.material.color.set(0xff0000); // 🔴 Rojo al pasar
      intersected = true;
    }
  } else {
    if (intersected) {
      wireframe.material.color.set(0x000000); // ⚫ Vuelve a negro
      intersected = false;
    }
  }

  renderer.render(scene, camera);
}
animate();

// 📐 Responsive
window.addEventListener('resize', () => {
  renderer.setSize(container.clientWidth, 400);
  camera.aspect = container.clientWidth / 400;
  camera.updateProjectionMatrix();
});
// 🎯 Detectar intersección del mouse con el cubo
container.addEventListener('mousemove', (event) => {
  const rect = container.getBoundingClientRect();

  // Coordenadas normalizadas del mouse (-1 a 1)
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
});

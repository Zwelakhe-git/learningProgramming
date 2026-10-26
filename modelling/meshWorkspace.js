import { THREE, scene } from "./init_scene.js";
import { translateMesh } from "./translateMesh.js";

const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 16),
    new THREE.MeshBasicMaterial({
        color: 0xf39316
    })
);

const position = new THREE.Vector3(3, 2, 5);
const angle = Math.random() * Math.PI * 2;
const elevationAngle = (Math.random() - 0.5) * Math.PI;

const direction = new THREE.Vector3(
    Math.cos(angle) * Math.cos(elevationAngle),
    Math.sin(angle) * Math.cos(elevationAngle),
    Math.sin(elevationAngle)
).normalize();

point.position.copy(position);
scene.add(point);
let directionVector = new THREE.ArrowHelper(
    direction,
    position,
    1,
    0xff00ff
);
scene.add(directionVector);

let velocity = direction.clone().multiplyScalar(2);

setTimeout(() => {
    translateMesh(point, velocity, 5000);
}, 1500);

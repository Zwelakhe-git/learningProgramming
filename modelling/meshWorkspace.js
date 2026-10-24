import { THREE, scene } from "./init_scene.js";
import { rotate_mesh } from "./rotatingAMesh.js";
import { resize_mesh } from "./resizeMesh.js";

const circle = new THREE.Mesh(
    new THREE.CircleGeometry(5, 64),
    new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xffffff
    })
);

circle.position.set(0, 0, 0);
circle.castShadow = true;
circle.receiveShadow = true;
scene.add(circle)

setTimeout(() => {
    rotate_mesh(circle, 'x', 90, 3000);
    setTimeout(() => {
        resize_mesh(circle, 0.5, 3000);
    });
}, 2000);
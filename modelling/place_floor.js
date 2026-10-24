import { scene, THREE } from "./init_scene.js"

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1, 16, 1),
    new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
    })
)
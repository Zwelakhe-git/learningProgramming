import { THREE, camera, renderer, scene } from "./init_scene.js"

const circle = new THREE.Mesh(
    new THREE.CircleGeometry(10, 26),
    new THREE.MeshPhongMaterial({
        color: 0xffffff,
        opacity: 1,
        shininess: 100,
        specular: 0xffffff
    })
);

circle.position.set(0, 0, 0);
circle.castShadow = true;
circle.receiveShadow = true;

const ease = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

function rotate_mesh(mesh, axis = 'x', angleDeg = 45, duration=1){
    const targetAngle = angleDeg * Math.PI / 180;
    const startAngle = mesh.rotation.x;
    const startTime = performance.now();
    function animate(now){
        const t = Math.min((now - startTime) / duration, 1);
        const eased = ease(t);
        mesh.rotation[axis] = startAngle + (targetAngle - startAngle) * eased;

        renderer.render(scene, camera);

        if( t < 1){
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);

}
scene.add(circle)
import { camera, renderer, scene } from "./init_scene.js"
import { ease } from "./animationFunctions.js";


export function rotate_mesh(mesh, axis = 'x', angleDeg = 45, duration=1000){
    const targetAngle = angleDeg * Math.PI / 180;
    const startAngle = mesh.rotation[axis];
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

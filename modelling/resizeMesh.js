import { scene, renderer, camera } from "./init_scene.js";
import { ease } from "./animationFunctions.js";

export function resize_mesh(mesh, scale = 1, duration = 1000){
    const startTime = performance.now()

    function animate(now){
        const t = Math.min((now - startTime) / duration, 1);
        const eased = ease(t);

        mesh.scale.setScalar(1 + scale * eased);
        renderer.render(scene, camera);
        if (t < 1){
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}
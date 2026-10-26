import { ease } from "./animationFunctions.js";

export function translateMesh(mesh, velocity, duration = 1000){
    const initPos = mesh.position.clone();
    const startTime = performance.now();
    function animate(now){
        const t = Math.min((now - startTime) / duration, 1);
        const eased = ease(t);
        // p_new = p + v*t
        mesh.position.copy(initPos).addScaledVector(velocity, eased);

        if( t < 1){
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}
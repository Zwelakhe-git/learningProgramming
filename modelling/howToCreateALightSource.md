
```js
const pointLight = new THREE.PointLight(0xffffff, 180, 100, 2);
pointLight.position.set(0, 8, 5);
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(2048, 2048);
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 40;
pointLight.shadow.bias = -0.0002;
pointLight.shadow.normalBias = 0.025;
pointLight.shadow.radius = 4;
scene.add(pointLight);

const lightMarker = new THREE.Mesh(
  new THREE.SphereGeometry(0.16, 16, 12),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
pointLight.add(lightMarker);
```
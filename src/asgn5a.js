import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setClearColor( 0xffffff, 0);
    
    const fov = 50;
    const aspect = window.innerWidth / window.innerHeight;;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0,10,20);

    const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

    const scene = new THREE.Scene();
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-100, 200, 400);
    scene.add(light);

    var ambientLight = new THREE.AmbientLight(0xffffff, 1); // Added Ambient lighting for Orbital Controls
    scene.add(ambientLight);

    
    // Cylinder
    const cylinderHeight = 2;
    const radialSegments = 12;
    const radiusTop = 1;
    const radiusBottom = 1;
    
    const cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, cylinderHeight, radialSegments);
    const cylinderMaterial = new THREE.MeshPhongMaterial({color: 0x0097FF});
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder);
    cylinder.position.x = 2.0;

    // Egg (Sphere)
    const radius = 1.2;   
    const widthSegments = 10;  
    const heightSegments = 14;  
    const sphereGeometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
    const sphereMaterial = new THREE.MeshPhongMaterial({color: 0x0097FF});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.x = -4;

    // Cube + Texture Pack (Minecraft Diamond Ore)
    const boxWidth = 2;
    const boxHeight = 2;
    const boxDepth = 2;
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../resources/images/minecraft_diamond_ore.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;

    const boxMaterial = new THREE.MeshPhongMaterial({map: texture});
    const cube = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(cube);
    cube.position.y = 0;
    cube.position.x = -0.9;

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlLoader.load('../resources/models/katana.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('../resources/models/katana.obj', (root) => {
    root.scale.set(1.5, 1.5, 1.5);
    root.rotation.y = 120;
    root.position.set(5, -5, 0);
    scene.add(root);
    });
  });

    // Render()
    function render(time) {
        time *= 0.001;  // convert time to seconds
        
        cube.rotation.x = time;
        cube.rotation.y = time;
        sphere.rotation.x = time;
        sphere.rotation.y = time;
        cylinder.rotation.x = time;


        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();

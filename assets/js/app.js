// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"
import "./user_socket.js"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: {_csrf_token: csrfToken}
})

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
window.liveSocket = liveSocket



// ### THREE.js ###this.addPoint
import * as THREE from 'three';
import { OrbitControls } from './OrbitControls.js';

let container;
let camera, scene, renderer, points, controls;

init();

function init() {
    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
    camera.position.z = 2750;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.Fog(0x050505, 2000, 3500);

    const particles = 500000;
    const geometry = new THREE.BufferGeometry();

    const arrayBuffer = new ArrayBuffer(particles * 16);
    const interleavedFloat32Buffer = new Float32Array(arrayBuffer);
    const interleavedUint8Buffer = new Uint8Array(arrayBuffer);

    const color = new THREE.Color();

    const n = 1000, n2 = n / 2; // particles spread in the cube

    const radius = 6; // spiral radius
    const segments = particles; // to control the smoothness of the spiral

    // Function to add a point
    function addPoint(angle, height, index) {
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const z = height;

        interleavedFloat32Buffer[index * 4 + 0] = x;
        interleavedFloat32Buffer[index * 4 + 1] = y;
        interleavedFloat32Buffer[index * 4 + 2] = z;

        // color based on angle for gradient effect
        const vx = (Math.cos(angle) + 1) / 2;
        const vy = (Math.sin(angle) + 1) / 2;
        const vz = (z / n) + 0.5;

        color.setRGB(vx, vy, vz);

        const j = (index * 4 + 3) * 4;

        interleavedUint8Buffer[j + 0] = color.r * 255;
        interleavedUint8Buffer[j + 1] = color.g * 255;
        interleavedUint8Buffer[j + 2] = color.b * 255;
        interleavedUint8Buffer[j + 3] = 255; // not needed
    }

    // Add points to the spiral
    for (let i = 0; i < segments; i++) {
        const angle = i * 0.01;
        const height = i * 0.01;
        addPoint(angle, height, i);
    }

    console.log("Added in total around points: " + segments)

    const interleavedBuffer32 = new THREE.InterleavedBuffer(interleavedFloat32Buffer, 4);
    const interleavedBuffer8 = new THREE.InterleavedBuffer(interleavedUint8Buffer, 16);

    geometry.setAttribute('position', new THREE.InterleavedBufferAttribute(interleavedBuffer32, 3, 0, false));
    geometry.setAttribute('color', new THREE.InterleavedBufferAttribute(interleavedBuffer8, 3, 12, true));

    const material = new THREE.PointsMaterial({ size: 0.8, vertexColors: true, sizeAttenuation: false, pointSize: 1.5 });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Attach the controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true; // Enable zoom with mouse wheel

    renderer.setAnimationLoop(animate);

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    const time = 0.001;

    points.rotation.x = time * 0.25;
    points.rotation.y = time * 0.5;

    controls.update(); // Update controls for camera movements

    renderer.render(scene, camera);
}

export function addPointToGrid() {
    //foo
};
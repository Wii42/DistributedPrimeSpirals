// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

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

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
window.liveSocket = liveSocket



// ### THREE.js ###
import * as THREE from 'three';

let scene, camera, renderer;
let totalPoints = 0;
const cameraZBase = 10;
let points = []; // Store all points for visibility checks

// Cached geometries and materials
let sphereGeometry, sphereMaterial, twinkleMaterial;

// Initialize the scene
function initializeScene() {
    // Create scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    // Configure renderer and add to DOM
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 10);
    scene.add(directionalLight);

    // Configure camera position
    camera.position.set(0, 0, cameraZBase);
    camera.lookAt(0, 0, 0);

    // Precreate reusable geometry and materials
    sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x0077ff,
        emissive: 0x000000,
        roughness: 0.4,
        metalness: 0.3,
    });

    twinkleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
    });

    // Start rendering loop
    animate();
}

// Add a point to the scene
function addPoint(x, y, z, size = 0.05) {
    // Create sphere and set its position and size
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.scale.setScalar(size);
    sphere.position.set(x, y, z);
    scene.add(sphere);

    // Track the total number of points
    totalPoints++;
    points.push(sphere); // Store the sphere for later visibility checks or manipulation

    // Add twinkle effect for visual flair
    createTwinkleEffect(x, y, z, size);

    // Update the on-screen point count
    updateInfoDisplay();
}

// Create a reusable twinkle effect
function createTwinkleEffect(x, y, z, size) {
    const twinkle = new THREE.Mesh(sphereGeometry, twinkleMaterial);
    twinkle.scale.setScalar(size * 1.5);
    twinkle.position.set(x, y, z);
    scene.add(twinkle);

    const startTime = Date.now();
    const twinkleDuration = 400;

    function animateTwinkle() {
        const elapsed = Date.now() - startTime;

        if (elapsed < twinkleDuration) {
            const progress = elapsed / twinkleDuration;

            // Flash-up effect
            if (progress < 0.5) {
                twinkle.material.opacity = 0.8 + 0.4 * progress;
                twinkle.scale.setScalar(size * (1 + 2 * progress));
            } else {
                twinkle.material.opacity = 1 - progress;
                twinkle.scale.setScalar(size * (3 - 2 * progress));
            }

            requestAnimationFrame(animateTwinkle);
        } else {
            scene.remove(twinkle);
        }
    }

    animateTwinkle();
}

// Update the info display with the current point count
function updateInfoDisplay() {
    document.getElementById('info-div').innerHTML = `<p>Total Points: ${totalPoints}</p>`;
}

// Animation loop
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Initialize the scene
initializeScene();


// Exported function to add incoming points from user_socket.js
export function addPointToGrid(x, y) {
  console.log("Received point:" + x + " and " + y);

  addPoint(x, y, 0);
}

//document.addEventListener("DOMContentLoaded", initThreeJs);
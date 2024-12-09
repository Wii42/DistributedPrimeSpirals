import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js'; // Import the Stats library

let scene, camera, renderer, particles, particleMaterial, particleGeometry, stats;
let pointsAdded = 0;
let controls;

// Initialize the particle system
function initParticleSystem(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Particle system setup
    particleGeometry = new THREE.BufferGeometry();
    const maxParticles = 500000;

    const positions = new Float32Array(maxParticles * 3); // x, y, z for each particle
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    particleMaterial = new THREE.PointsMaterial({
        color: 0xffcc00, // Warm yellow color for the particles
        size: 0.01,      // Size of the particles: 0.01 works nice with a particleMaterial.size of 0.2 
        sizeAttenuation: true, // Ensures correct size attenuation with distance
        vertexColors: false,   // Disables vertex coloring
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // OrbitControls for smooth zooming
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true; // Enable zoom with mouse wheel
    controls.enableRotate = false; // Disable rotation
    controls.enablePan = false; // Disable panning

    function updateParticleSize(camera) {
        // Calculate the distance of the camera from the center of the scene
        const distance = camera.position.length();
    
        // Adjust the particle size based on the distance (e.g., using a logarithmic or linear scale)
        const scaleFactor = Math.max(1, 1 + distance * 0.01); // You can tweak the 0.01 for more/less effect
        particleMaterial.size = 0.2 * scaleFactor;
    }

    /*
    function updateZoomLevel() {
        const initialZ = 5; // The initial z-position of the camera
        const zoomLevel = Math.round((initialZ / camera.position.z) * 100) + '%'; // Reverse the scale logic
        document.getElementById('zoom').innerText = zoomLevel;
    }*/

    function updateZoomLevel() {
        const initialZ = 5; // The initial z-position of the camera
        const currentZ = camera.position.z; // Current z-position of the camera
        const zoomFactor = initialZ / currentZ; // Calculate zoom factor based on the current distance from the initial position
        const zoomLevel = Math.round(zoomFactor * 100) + '%'; // Convert the zoom factor into a percentage
        document.getElementById('zoom').innerText = zoomLevel;
    
        // Adjust particle size based on zoom factor to ensure visibility
        const scaleFactor = Math.max(1, zoomFactor); // Ensure particles remain visible as zooming out
        particleMaterial.size = 0.02 * scaleFactor;
    }

    // Update zoom level on control change
    controls.addEventListener('change', updateZoomLevel);
    updateZoomLevel(); // Initialize display

    // Stats for FPS display
    const statsContainer = document.getElementById('stats'); // Use specific div for stats
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: memory
    stats.dom.style.position = 'absolute';
    statsContainer.appendChild(stats.dom); // Append stats to the designated div

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Update controls for camera movements

        // Update particle size based on the camera's distance
        updateParticleSize(camera);

        // Update stats
        stats.update(); // Update the stats instance

        renderer.render(scene, camera);
    }
    animate();
}

// Add a single particle to the system
function addPoint(x, y) {
    if (!particleGeometry) {
        console.error("Particle system not initialized. Call initParticleSystem() first.");
        return;
    }

    if (pointsAdded >= particleGeometry.attributes.position.array.length / 3) {
        console.warn("Maximum number of particles reached.");
        return;
    }

    const positions = particleGeometry.attributes.position.array;
    const index = pointsAdded * 3;

    positions[index] = x;
    positions[index + 1] = y;
    positions[index + 2] = 0; // z-coordinate is 0 for 2D plane

    pointsAdded++;

    particleGeometry.attributes.position.needsUpdate = true; // Notify THREE.js to update geometry

    // Update the number of points displayed
    document.getElementById('number-of-primes').innerText = `Primes: ${pointsAdded}`;
}

// Initialize particle system (for example use)
initParticleSystem('container');


export function addPointToGrid(x, y) {
    addPoint(x, y);
};


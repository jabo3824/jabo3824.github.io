const locations = [
    { name: 'New York, NY', lat: 40.7128, lon: -74.0060, city: 'New York', country: 'USA' },
    { name: 'Englewood Cliffs, NJ', lat: 40.8826, lon: -73.9474, city: 'Englewood Cliffs', country: 'USA' },
    { name: 'Orlando, FL', lat: 28.5383, lon: -81.3792, city: 'Orlando', country: 'USA' },
    { name: 'Washington D.C.', lat: 38.9072, lon: -77.0369, city: 'Washington', country: 'USA' },
    { name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437, city: 'Los Angeles', country: 'USA' },
    { name: 'Minneapolis, MN', lat: 44.9778, lon: -93.2650, city: 'Minneapolis', country: 'USA' },
    { name: 'Stamford, CT', lat: 41.0534, lon: -73.5387, city: 'Stamford', country: 'USA' },
    { name: 'London', lat: 51.5074, lon: -0.1278, city: 'London', country: 'UK' },
    { name: 'Belfast', lat: 54.5973, lon: -5.9301, city: 'Belfast', country: 'UK' },
    { name: 'South Africa', lat: -30.5595, lon: 22.9375, city: 'Johannesburg', country: 'South Africa' },
    { name: 'France', lat: 48.8566, lon: 2.3522, city: 'Paris', country: 'France' },
    { name: 'UAE', lat: 25.2048, lon: 55.2708, city: 'Dubai', country: 'UAE' },
    { name: 'Singapore', lat: 1.3521, lon: 103.8198, city: 'Singapore', country: 'Singapore' },
    { name: 'Hong Kong', lat: 22.3193, lon: 114.1694, city: 'Hong Kong', country: 'Hong Kong' },
    { name: 'China', lat: 31.2304, lon: 121.4737, city: 'Shanghai', country: 'China' }
];

let scene, camera, renderer, globe, markers = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationVelocity = { x: 0, y: 0 };
let isAnimatingToLocation = false;
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };

function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

function init() {
    const container = document.getElementById('globe-container');
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 3;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/img/earth-texture.jpg');

    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 10,
        specular: 0x222222
    });
    globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    locations.forEach((location) => {
        // Create glowing orb with multiple layers
        const markerGroup = new THREE.Group();
        
        // Inner core - bright and solid
        const coreGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        markerGroup.add(core);
        
        // Middle glow layer
        const glowGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x829CB2,
            transparent: true,
            opacity: 0.6
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        markerGroup.add(glow);
        
        // Outer glow layer
        const outerGlowGeometry = new THREE.SphereGeometry(0.04, 16, 16);
        const outerGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0x829CB2,
            transparent: true,
            opacity: 0.3
        });
        const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        markerGroup.add(outerGlow);
        
        // Add point light for glow effect
        const pointLight = new THREE.PointLight(0x829CB2, 0.5, 0.2);
        markerGroup.add(pointLight);
        
        const pos = latLonToVector3(location.lat, location.lon, 1.02);
        markerGroup.position.copy(pos);
        markerGroup.userData = { location };
        
        scene.add(markerGroup);
        markers.push(markerGroup);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 100);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x4466ff, 0.3, 100);
    pointLight2.position.set(-5, -3, -5);
    scene.add(pointLight2);

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onClick);

    window.addEventListener('resize', onWindowResize);

    animate();
}

function onMouseDown(e) {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
}

function onMouseMove(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        rotationVelocity.x = deltaY * 0.005;
        rotationVelocity.y = deltaX * 0.005;
        
        globe.rotation.y += rotationVelocity.y;
        globe.rotation.x += rotationVelocity.x;
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    }
}

function onMouseUp() {
    isDragging = false;
}

function onClick() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers, true);
    
    if (intersects.length > 0) {
        const clickedMarker = intersects[0].object.parent;
        const location = clickedMarker.userData.location;
        animateToLocation(location, clickedMarker);
        showLocationInfo(location);
    } else {
        closeLocationInfo();
    }
}

function animateToLocation(location, marker) {
    const basePos = latLonToVector3(location.lat, location.lon, 1.02);
    
    const targetY = -Math.atan2(basePos.x, basePos.z);
    const targetX = Math.asin(basePos.y / 1.02);
    
    targetRotation.y = targetY;
    targetRotation.x = targetX;
    
    isAnimatingToLocation = true;
    rotationVelocity = { x: 0, y: 0 };
}

function showLocationInfo(location) {
    document.getElementById('location-city').textContent = location.city;
    document.getElementById('location-country').textContent = location.country;
    document.getElementById('location-name').textContent = location.name;
    document.getElementById('location-info').classList.add('active');
}

function closeLocationInfo() {
    document.getElementById('location-info').classList.remove('active');
}

function onWindowResize() {
    const container = document.getElementById('globe-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (isAnimatingToLocation) {
        let dx = normalizeAngle(targetRotation.x - globe.rotation.x);
        let dy = normalizeAngle(targetRotation.y - globe.rotation.y);
        
        globe.rotation.x += dx * 0.1;
        globe.rotation.y += dy * 0.1;
        
        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
            globe.rotation.x = targetRotation.x;
            globe.rotation.y = targetRotation.y;
            isAnimatingToLocation = false;
        }
    } else if (!isDragging) {
        rotationVelocity.x *= 0.95;
        rotationVelocity.y *= 0.95;
        globe.rotation.y += rotationVelocity.y;
        globe.rotation.x += rotationVelocity.x;
    }

    markers.forEach((marker, index) => {
        const location = locations[index];
        const pos = latLonToVector3(location.lat, location.lon, 1.02);
        
        const matrix = new THREE.Matrix4();
        matrix.makeRotationFromEuler(globe.rotation);
        pos.applyMatrix4(matrix);
        
        marker.position.copy(pos);
        
        // Pulse effect for glow
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time * 2 + index) * 0.2 + 0.8;
        marker.children[1].material.opacity = 0.6 * pulse;
        marker.children[2].material.opacity = 0.3 * pulse;
    });

    renderer.render(scene, camera);
}

function normalizeAngle(angle) {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
}

init();
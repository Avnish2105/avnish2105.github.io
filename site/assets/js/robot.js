// Interactive 3D quadruped in the home hero (ES module).
//
// Progressive enhancement: the static SVG robot in the markup stays visible when
// reduced motion is on, WebGL is missing, or the Three.js CDN import fails.
// The joke bubble and the "Ping the robot" button work in every case.
//
// Three.js is the one approved external dependency (see CLAUDE.md section 3).
// It is pinned and loaded only after the page is idle.

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const stage = document.getElementById('robotStage');
const hero = document.querySelector('.hero');
const bubble = document.getElementById('robotBubble');
const pingBtn = document.getElementById('pingRobot');
const hudMode = document.getElementById('hudMode');
const hudTarget = document.getElementById('hudTarget');
const hudGait = document.getElementById('hudGait');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Jokes (shown in the speech bubble) ----------
const roboticsJokes = [
    "If you ever feel useless, just remember: An over-discharged LiPo is still technically a battery.",
    "I told my robot, \"You still have so much potential!\"\nIt said, \"Bro, I'm at 2.9V per cell... stop lying.\"",
    "An over-discharged LiPo is like a gifted student who never slept —\nBurned out, unstable, and full of wasted potential.",
    "Told my robot to navigate using ROS 2...\nNow it publishes its anxiety and subscribes to bad decisions.",
    "I tried debugging a ROS 2 launch file.\nNow I'm 4 hours older, 3 terminals deeper, and questioning all my parameters in life.",
    "Configured navigation in ROS 2…\nRobot made it 2 meters, gave up, and started broadcasting emotional damage.",
    "Running Humble on my robot.\nNow it's very humble about its capabilities.",
    "Flashed new firmware to the robot.\nNow it thinks it's a blender.",
    "Robot started spinning uncontrollably after a debug session.\nI told my team it's \"just stress testing the chassis.\"",
    "Put the robot in debug mode.\nNow it's just sitting there… judging me.",
    "Maturity is when you name your bugs, because at this point…\nThey've been with you longer than some of your friends.",
    "Maturity is when you stop chasing perfection,\nand start chasing the one log file that might tell you why the IMU is upside down again."
];

let jokeIndex = -1;
let bubbleTimer = 0;
let robot = null; // set once the 3D scene is live: { hop() }

function sayJoke() {
    if (!bubble) return;
    jokeIndex = (jokeIndex + 1) % roboticsJokes.length;
    bubble.textContent = roboticsJokes[jokeIndex];
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 7000);
}

function ping() {
    sayJoke();
    if (robot) robot.hop();
}

if (pingBtn) pingBtn.addEventListener('click', ping);

// ---------- Boot the 3D scene ----------
function webglAvailable() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) {
        return false;
    }
}

if (stage && hero && !reduceMotion && webglAvailable()) {
    const start = () => {
        import(THREE_URL)
            .then((THREE) => { robot = initScene(THREE); })
            .catch((err) => { console.warn('3D robot unavailable, keeping the static drawing.', err); });
    };
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 400);
}

// ---------- Helpers ----------
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const smooth = (t) => t * t * (3 - 2 * t);

function initScene(THREE) {
    const mobileQuery = window.matchMedia('(max-width: 900px)');

    // ----- Renderer, scene, camera -----
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    stage.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x070b14, 6.5, 15);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
    const lookAt = new THREE.Vector3();

    // ----- Lights -----
    scene.add(new THREE.HemisphereLight(0x9bb8ff, 0x0a0f1a, 1.1));

    const key = new THREE.DirectionalLight(0xffe0b0, 2.6);
    key.position.set(-3, 6.5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 });
    key.shadow.bias = -0.0008;
    key.shadow.radius = 5;
    scene.add(key, key.target);

    const rim = new THREE.DirectionalLight(0x3b82f6, 4.0);
    rim.position.set(3, 3, -5);
    scene.add(rim);

    // ----- Floor: shadow catcher + fading grid -----
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.5 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(30, 60, 0x1e293b, 0x1e293b);
    grid.material.transparent = true;
    grid.material.opacity = 0.55;
    grid.position.y = 0.002;
    scene.add(grid);

    // ----- Materials -----
    const M = {
        shell: new THREE.MeshStandardMaterial({ color: 0x1d2944, metalness: 0.55, roughness: 0.36 }),
        plate: new THREE.MeshStandardMaterial({ color: 0x31436b, metalness: 0.5, roughness: 0.3 }),
        dark: new THREE.MeshStandardMaterial({ color: 0x0a0f1c, metalness: 0.4, roughness: 0.55 }),
        joint: new THREE.MeshStandardMaterial({ color: 0x141c2e, metalness: 0.7, roughness: 0.3 }),
        rubber: new THREE.MeshStandardMaterial({ color: 0x07090f, metalness: 0.1, roughness: 0.9 }),
        blue: new THREE.MeshStandardMaterial({ color: 0x93c5fd, emissive: 0x3b82f6, emissiveIntensity: 2.4 }),
        amber: new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 2.0 }),
        hit: new THREE.MeshBasicMaterial({ visible: false })
    };

    function mesh(geo, mat, cast = true) {
        const m = new THREE.Mesh(geo, mat);
        m.castShadow = cast;
        return m;
    }

    // ----- Robot -----
    // Body frame: +x forward, +y up, +z to the robot's right... (left-handed naming aside,
    // only the x/y plane matters for the leg IK).
    const L1 = 0.3;          // thigh
    const L2 = 0.32;         // shin
    const FOOT_R = 0.042;
    const STAND_H = 0.5;     // body centre height when standing

    const root = new THREE.Group();     // position on the floor + heading
    const body = new THREE.Group();     // height, pitch, roll
    root.add(body);
    scene.add(root);

    // Torso: a flattened, widened capsule reads as a moulded shell
    const torso = mesh(new THREE.CapsuleGeometry(0.15, 0.62, 6, 18), M.shell);
    torso.rotation.z = Math.PI / 2;
    torso.scale.set(0.82, 1, 1.32);
    body.add(torso);

    const deck = mesh(new THREE.BoxGeometry(0.6, 0.03, 0.28), M.plate);
    deck.position.y = 0.118;
    body.add(deck);

    for (const side of [-1, 1]) {
        const strip = mesh(new THREE.BoxGeometry(0.48, 0.016, 0.01), M.blue, false);
        strip.position.set(0.02, 0.0, side * 0.199);
        body.add(strip);
        const vent = mesh(new THREE.BoxGeometry(0.16, 0.05, 0.012), M.dark, false);
        vent.position.set(-0.18, -0.045, side * 0.19);
        body.add(vent);
    }

    // LiDAR puck with a spinning head
    const lidarBase = mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.05, 24), M.dark);
    lidarBase.position.set(-0.04, 0.158, 0);
    body.add(lidarBase);
    const lidarTop = new THREE.Group();
    lidarTop.position.set(-0.04, 0.2, 0);
    const lidarCap = mesh(new THREE.CylinderGeometry(0.06, 0.068, 0.035, 24), M.shell);
    const lidarEye = mesh(new THREE.BoxGeometry(0.02, 0.014, 0.05), M.blue, false);
    lidarEye.position.x = 0.06;
    lidarTop.add(lidarCap, lidarEye);
    body.add(lidarTop);

    // Antenna with a blinking tip
    const antenna = new THREE.Group();
    antenna.position.set(-0.36, 0.12, 0.09);
    antenna.rotation.z = 0.35;
    const mast = mesh(new THREE.CylinderGeometry(0.006, 0.009, 0.24, 8), M.joint);
    mast.position.y = 0.12;
    const tip = mesh(new THREE.SphereGeometry(0.018, 12, 12), M.amber, false);
    tip.position.y = 0.245;
    antenna.add(mast, tip);
    body.add(antenna);

    const tailLight = mesh(new THREE.BoxGeometry(0.012, 0.03, 0.14), M.amber, false);
    tailLight.position.set(-0.505, 0.02, 0);
    body.add(tailLight);

    // Head on a neck pivot
    const neck = new THREE.Group();
    neck.position.set(0.44, 0.06, 0);
    body.add(neck);
    const head = new THREE.Group();
    neck.add(head);
    const skull = mesh(new THREE.BoxGeometry(0.2, 0.13, 0.24), M.shell);
    skull.position.x = 0.07;
    const brow = mesh(new THREE.BoxGeometry(0.17, 0.02, 0.22), M.plate);
    brow.position.set(0.07, 0.073, 0);
    const visor = mesh(new THREE.BoxGeometry(0.02, 0.07, 0.2), M.dark, false);
    visor.position.set(0.172, 0, 0);
    const eyes = new THREE.Group();
    eyes.position.set(0.184, 0.004, 0);
    for (const side of [-1, 1]) {
        const eye = mesh(new THREE.SphereGeometry(0.022, 14, 14), M.blue, false);
        eye.scale.x = 0.4;
        eye.position.z = side * 0.05;
        eyes.add(eye);
    }
    const eyeLight = new THREE.PointLight(0x60a5fa, 1.6, 2.2, 2);
    eyeLight.position.set(0.3, -0.05, 0);
    head.add(skull, brow, visor, eyes, eyeLight);

    // Invisible hit box so clicks on thin legs still count
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.85, 0.6), M.hit);
    hitBox.position.y = -0.15;
    body.add(hitBox);

    // Legs: FL, FR, RL, RR. Diagonal pairs trot together.
    const legDefs = [
        { x: 0.31, z: -0.235 },
        { x: 0.31, z: 0.235 },
        { x: -0.31, z: -0.235 },
        { x: -0.31, z: 0.235 }
    ];
    const pairs = [[0, 3], [1, 2]];

    const legs = legDefs.map((d) => {
        const hip = new THREE.Group();
        hip.position.set(d.x, -0.03, d.z);
        body.add(hip);

        const actuator = mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.085, 20), M.joint);
        actuator.rotation.x = Math.PI / 2;
        const ring = mesh(new THREE.TorusGeometry(0.068, 0.008, 6, 24), M.amber, false);
        ring.position.z = Math.sign(d.z) * 0.044;
        hip.add(actuator, ring);

        const thigh = new THREE.Group();
        hip.add(thigh);
        const thighMesh = mesh(new THREE.CapsuleGeometry(0.042, L1 - 0.06, 4, 12), M.plate);
        thighMesh.position.y = -L1 / 2;
        thighMesh.scale.z = 1.25;
        thigh.add(thighMesh);

        const knee = new THREE.Group();
        knee.position.y = -L1;
        thigh.add(knee);
        const kneeJoint = mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.07, 16), M.joint);
        kneeJoint.rotation.x = Math.PI / 2;
        const shinMesh = mesh(new THREE.CapsuleGeometry(0.026, L2 - 0.05, 4, 10), M.shell);
        shinMesh.position.y = -L2 / 2;
        const foot = mesh(new THREE.SphereGeometry(FOOT_R, 14, 14), M.rubber);
        foot.position.y = -L2;
        knee.add(kneeJoint, shinMesh, foot);

        return {
            hipLocal: hip.position.clone(),
            thigh,
            knee,
            foot: new THREE.Vector3(),   // planted / swinging world position
            start: new THREE.Vector3(),
            home: new THREE.Vector3()
        };
    });

    // ----- Goal marker + planned path (ROS-style nav goal) -----
    const marker = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.9, depthWrite: false });
    const markerRing = new THREE.Mesh(new THREE.RingGeometry(0.13, 0.155, 48), ringMat);
    const pulseMat = ringMat.clone();
    const markerPulse = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.165, 48), pulseMat);
    const cross = new THREE.Mesh(new THREE.RingGeometry(0, 0.03, 16), ringMat);
    for (const m of [markerRing, markerPulse, cross]) {
        m.rotation.x = -Math.PI / 2;
        marker.add(m);
    }
    marker.position.y = 0.006;
    scene.add(marker);

    const PATH_N = 28;
    const pathGeo = new THREE.BufferGeometry();
    pathGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PATH_N * 3), 3));
    const pathMat = new THREE.LineDashedMaterial({ color: 0x60a5fa, dashSize: 0.06, gapSize: 0.05, transparent: true, opacity: 0.8 });
    const path = new THREE.Line(pathGeo, pathMat);
    path.frustumCulled = false;
    scene.add(path);

    // LiDAR scan ring that sweeps out from the robot
    const scanMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0, depthWrite: false });
    const scan = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 64), scanMat);
    scan.rotation.x = -Math.PI / 2;
    scan.position.y = 0.004;
    scene.add(scan);

    // ----- State -----
    const pos = new THREE.Vector3(0, 0, 0);
    const target = new THREE.Vector3(0, 0, 0);
    const lookPoint = new THREE.Vector3();
    const bounds = { xMin: -1, xMax: 1, zMin: -1.2, zMax: 1 };
    let yaw = -Math.PI / 2 + 0.75;   // three-quarter view, facing the text
    let yawRate = 0;
    let speed = 0;
    let lastPointer = -1e9;
    let lastInput = -1e9;
    let nextWander = 0;
    let swingPair = -1;
    let lastPair = 1;
    let swingT = 0;
    let swingDur = 0.3;
    let bootT = 0;           // stand-up animation
    let hopPhase = 'none';   // none | crouch | air | land
    let hopT = 0;
    let hopY = 0;
    let hopV = 0;
    let spin = 0;
    let spinOnHop = false;
    let hopCount = 0;
    let headYaw = 0;
    let headPitch = 0;
    let blinkAt = 2;
    let hudAt = 0;
    let pointerNdc = null;
    let hovering = false;
    let isMobile = mobileQuery.matches;

    const tmp = new THREE.Vector3();
    const tmp2 = new THREE.Vector3();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    function clampToBounds(v) {
        v.x = clamp(v.x, bounds.xMin, bounds.xMax);
        v.z = clamp(v.z, bounds.zMin, bounds.zMax);
        return v;
    }

    // ----- Layout: frame the robot right of the hero text on desktop -----
    function layout() {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        if (!w || !h) return;
        isMobile = mobileQuery.matches;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.fov = isMobile ? 36 : 30;

        const camY = isMobile ? 1.35 : 1.75;
        const camZ = isMobile ? 3.5 : 5.4;
        const lookY = isMobile ? 0.42 : 0.72;
        const dist = Math.hypot(camY - lookY, camZ);
        const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
        const halfW = halfH * camera.aspect;

        const shift = isMobile ? 0 : -0.4 * halfW;
        camera.position.set(shift, camY, camZ);
        lookAt.set(shift, lookY, 0);
        camera.lookAt(lookAt);
        camera.updateProjectionMatrix();

        if (isMobile) {
            const m = Math.max(halfW - 0.7, 0.35);
            Object.assign(bounds, { xMin: -m, xMax: m, zMin: -1.0, zMax: 0.5 });
        } else {
            const xMin = -0.34 * halfW + 0.4;
            const xMax = Math.max(0.56 * halfW - 0.45, xMin + 0.5);
            Object.assign(bounds, { xMin, xMax, zMin: -1.5, zMax: 0.9 });
        }
        clampToBounds(target);
        clampToBounds(pos);
    }

    // ----- Initial pose -----
    layout();
    pos.set(lerp(bounds.xMin, bounds.xMax, 0.55), 0, 0);
    target.copy(pos);
    lookPoint.copy(camera.position);

    function computeHomes(lead) {
        root.position.copy(pos);
        root.rotation.y = yaw + spin;
        root.updateMatrixWorld(true);
        const fwdX = Math.cos(yaw);
        const fwdZ = -Math.sin(yaw);
        for (const leg of legs) {
            tmp.set(leg.hipLocal.x, 0, leg.hipLocal.z * 1.06);
            root.localToWorld(leg.home.copy(tmp));
            leg.home.x += fwdX * speed * lead;
            leg.home.z += fwdZ * speed * lead;
            leg.home.y = FOOT_R;
        }
    }

    computeHomes(0);
    legs.forEach((leg) => leg.foot.copy(leg.home));

    // ----- Input -----
    function groundHit(clientX, clientY) {
        const r = renderer.domElement.getBoundingClientRect();
        if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return null;
        ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
        raycaster.setFromCamera(ndc, camera);
        return raycaster.ray.intersectPlane(groundPlane, tmp2) ? tmp2 : null;
    }

    function robotHit(clientX, clientY) {
        const r = renderer.domElement.getBoundingClientRect();
        ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
        raycaster.setFromCamera(ndc, camera);
        return raycaster.intersectObject(hitBox, false).length > 0;
    }

    hero.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        pointerNdc = { x: e.clientX, y: e.clientY };
        const hit = groundHit(e.clientX, e.clientY);
        if (!hit) return;
        const now = performance.now() / 1000;
        lastPointer = now;
        lastInput = now;
        lookPoint.set(hit.x, 0.3, hit.z);
        target.copy(clampToBounds(hit.clone()));
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
        pointerNdc = null;
        hovering = false;
        hero.style.cursor = '';
    });

    hero.addEventListener('pointerdown', (e) => {
        if (e.target.closest('a, button')) return;
        const r = renderer.domElement.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
        if (robotHit(e.clientX, e.clientY)) {
            ping();
            return;
        }
        // Touch and pen: tap the floor to send the robot there
        if (e.pointerType !== 'mouse' && !e.target.closest('.hero-text')) {
            const hit = groundHit(e.clientX, e.clientY);
            if (hit) {
                lastInput = performance.now() / 1000;
                lookPoint.set(hit.x, 0.3, hit.z);
                target.copy(clampToBounds(hit.clone()));
            }
        }
    });

    function hop() {
        if (hopPhase !== 'none' || bootT < 1) return;
        hopCount += 1;
        spinOnHop = hopCount % 3 === 0;
        hopPhase = 'crouch';
        hopT = 0;
    }

    // ----- Run loop: pause when the hero is off screen or the tab is hidden -----
    let visible = true;
    let running = false;
    let last = performance.now();

    function setRunning() {
        const should = visible && !document.hidden;
        if (should && !running) {
            running = true;
            last = performance.now();
            requestAnimationFrame(frame);
        } else if (!should) {
            running = false;
        }
    }

    new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        setRunning();
    }, { threshold: 0.01 }).observe(stage);
    document.addEventListener('visibilitychange', setRunning);
    new ResizeObserver(layout).observe(stage);

    // ----- Per-frame update -----
    let t = 0;

    function update(dt) {
        t += dt;
        bootT = Math.min(bootT + dt / 1.1, 1);

        // Idle wander after a while without input (also gives phones some life)
        const idleFor = t - lastInput;
        const wandering = idleFor > 7;
        if (wandering && t > nextWander) {
            target.set(
                lerp(bounds.xMin, bounds.xMax, Math.random()),
                0,
                lerp(bounds.zMin, bounds.zMax, Math.random())
            );
            nextWander = t + 4 + Math.random() * 4;
        }
        if (t - lastPointer > 2.5) {
            // Nobody steering: look at the viewer, or where it's heading
            tmp.copy(camera.position);
            lookPoint.lerp(speed > 0.2 ? tmp.set(target.x, 0.3, target.z) : tmp, 1 - Math.exp(-2 * dt));
        }

        // ---- Locomotion ----
        const grounded = hopPhase === 'none' && bootT >= 1;
        const dx = target.x - pos.x;
        const dz = target.z - pos.z;
        const dist = Math.hypot(dx, dz);
        let desiredSpeed = 0;
        let desiredTurn = 0;
        if (grounded && dist > 0.12) {
            const dyaw = wrapAngle(Math.atan2(-dz, dx) - yaw);
            desiredTurn = clamp(dyaw * 3.2, -2.4, 2.4);
            const facing = Math.max(0, Math.cos(dyaw));
            desiredSpeed = Math.min(1.15, dist * 1.7) * facing * facing;
        }
        const prevSpeed = speed;
        speed = damp(speed, desiredSpeed, 5, dt);
        yawRate = damp(yawRate, desiredTurn, 7, dt);
        yaw = wrapAngle(yaw + yawRate * dt);
        pos.x += Math.cos(yaw) * speed * dt;
        pos.z += -Math.sin(yaw) * speed * dt;
        clampToBounds(pos);
        const accel = (speed - prevSpeed) / Math.max(dt, 1e-3);

        // ---- Hop / spin ----
        let crouch = 0;
        if (hopPhase === 'crouch') {
            hopT += dt / 0.16;
            crouch = smooth(Math.min(hopT, 1)) * 0.1;
            if (hopT >= 1) { hopPhase = 'air'; hopV = 2.5; hopY = 0; spin = 0; }
        } else if (hopPhase === 'air') {
            hopV -= 9.8 * dt;
            hopY += hopV * dt;
            const airTime = (2 * 2.5) / 9.8;
            if (spinOnHop) spin = Math.min(spin + (Math.PI * 2 / airTime) * dt, Math.PI * 2);
            if (hopY <= 0) { hopY = 0; hopPhase = 'land'; hopT = 0; spin = 0; }
        } else if (hopPhase === 'land') {
            hopT += dt / 0.22;
            crouch = Math.sin(Math.min(hopT, 1) * Math.PI) * 0.07;
            if (hopT >= 1) hopPhase = 'none';
        }

        // ---- Foot placement (trot: diagonal pairs swing together) ----
        swingDur = clamp(0.32 - speed * 0.09, 0.2, 0.32);
        computeHomes(swingDur * 0.6);

        let bob = 0;
        if (hopPhase === 'air' || hopPhase === 'crouch' && hopT > 0.9) {
            // Feet tuck up and follow the body in the air
            legs.forEach((leg) => {
                leg.foot.copy(leg.home);
                leg.foot.y = FOOT_R + hopY * 0.75;
            });
            swingPair = -1;
        } else if (swingPair === -1) {
            const errs = pairs.map((p) => Math.max(...p.map((i) => Math.hypot(legs[i].foot.x - legs[i].home.x, legs[i].foot.z - legs[i].home.z))));
            const moving = speed > 0.05 || Math.abs(yawRate) > 0.15;
            const threshold = moving ? 0.025 : 0.05;
            const next = lastPair === 0 ? 1 : 0;
            if (errs[next] > threshold || errs[1 - next] > threshold) {
                swingPair = errs[next] >= errs[1 - next] * 0.4 ? next : 1 - next;
                swingT = 0;
                pairs[swingPair].forEach((i) => legs[i].start.copy(legs[i].foot));
            }
        }
        if (swingPair !== -1) {
            swingT += dt / swingDur;
            const s = Math.min(swingT, 1);
            const e = smooth(s);
            const lift = Math.sin(Math.PI * s) * clamp(0.05 + speed * 0.05, 0.05, 0.1);
            pairs[swingPair].forEach((i) => {
                const leg = legs[i];
                leg.foot.lerpVectors(leg.start, leg.home, e);
                leg.foot.y = FOOT_R + lift;
            });
            bob = Math.sin(Math.PI * s) * 0.012;
            if (swingT >= 1) {
                lastPair = swingPair;
                swingPair = -1;
            }
        }

        // ---- Body pose ----
        const bootH = lerp(0.24, STAND_H, smooth(bootT));
        const breathe = Math.sin(t * 2.1) * 0.006 * (1 - Math.min(speed, 1));
        body.position.y = bootH - crouch - bob + breathe + hopY;
        body.rotation.z = damp(body.rotation.z, clamp(-accel * 0.03, -0.08, 0.08) + (hopPhase === 'air' ? hopV * 0.03 : 0), 6, dt);
        body.rotation.x = damp(body.rotation.x, clamp(yawRate * speed * 0.09, -0.12, 0.12), 6, dt);
        root.position.copy(pos);
        root.rotation.y = yaw + spin;
        root.updateMatrixWorld(true);

        // ---- Leg IK (2-bone, knees point backwards) ----
        for (const leg of legs) {
            body.worldToLocal(tmp.copy(leg.foot));
            const lx = tmp.x - leg.hipLocal.x;
            const ly = tmp.y - leg.hipLocal.y;
            const d = clamp(Math.hypot(lx, ly), 0.08, L1 + L2 - 0.002);
            const phi = Math.atan2(lx, -ly);
            const alpha = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
            const th1 = phi - alpha;
            const kx = L1 * Math.sin(th1);
            const ky = -L1 * Math.cos(th1);
            // Foot along the clamped reach (keeps the shin pointing at the target)
            const fx = Math.sin(phi) * d;
            const fy = -Math.cos(phi) * d;
            const th2 = Math.atan2(fx - kx, -(fy - ky));
            leg.thigh.rotation.z = th1;
            leg.knee.rotation.z = th2 - th1;
        }

        // ---- Head tracks the look point ----
        body.updateMatrixWorld(true);
        neck.worldToLocal(tmp.copy(lookPoint));
        const wantYaw = clamp(Math.atan2(-tmp.z, tmp.x), -0.9, 0.9);
        const wantPitch = clamp(Math.atan2(tmp.y, Math.hypot(tmp.x, tmp.z)), -0.45, 0.4);
        headYaw = damp(headYaw, wantYaw, 6, dt);
        headPitch = damp(headPitch, wantPitch, 6, dt);
        head.rotation.set(0, headYaw, headPitch, 'YZX');

        // Blink
        if (t > blinkAt) {
            eyes.scale.y = 0.15;
            if (t > blinkAt + 0.12) {
                eyes.scale.y = 1;
                blinkAt = t + 2.5 + Math.random() * 3;
            }
        }

        // Details
        lidarTop.rotation.y += dt * 7;
        tip.material.emissiveIntensity = (Math.sin(t * 5) > 0.6) ? 3.2 : 0.4;
        antenna.rotation.x = Math.sin(t * 9) * 0.04 * (speed + (hopPhase !== 'none' ? 1 : 0));

        // ---- Goal marker + path ----
        marker.position.x = target.x;
        marker.position.z = target.z;
        const pulse = (t * 0.8) % 1;
        markerPulse.scale.setScalar(1 + pulse * 1.6);
        pulseMat.opacity = 0.7 * (1 - pulse);
        const showGoal = dist > 0.2 ? 1 : 0;
        ringMat.opacity = damp(ringMat.opacity, 0.9 * showGoal, 6, dt);
        pathMat.opacity = damp(pathMat.opacity, 0.75 * showGoal, 6, dt);

        const arr = pathGeo.attributes.position.array;
        const cx = pos.x + Math.cos(yaw) * dist * 0.5;
        const cz = pos.z - Math.sin(yaw) * dist * 0.5;
        for (let i = 0; i < PATH_N; i++) {
            const u = i / (PATH_N - 1);
            const a = (1 - u) * (1 - u);
            const b = 2 * (1 - u) * u;
            const c = u * u;
            arr[i * 3] = a * pos.x + b * cx + c * target.x;
            arr[i * 3 + 1] = 0.008;
            arr[i * 3 + 2] = a * pos.z + b * cz + c * target.z;
        }
        pathGeo.attributes.position.needsUpdate = true;
        path.computeLineDistances();

        const sweep = (t / 3.2) % 1;
        scan.position.x = pos.x;
        scan.position.z = pos.z;
        scan.scale.setScalar(0.3 + sweep * 2.2);
        scanMat.opacity = 0.35 * (1 - sweep) * (1 - sweep);

        // Keep the shadow camera around the robot
        key.target.position.set(pos.x, 0, pos.z);
        key.position.set(pos.x - 3, 6.5, pos.z + 4);

        // ---- Hover cursor (throttled) ----
        if (pointerNdc && Math.floor(t * 20) % 2 === 0) {
            const over = robotHit(pointerNdc.x, pointerNdc.y);
            if (over !== hovering) {
                hovering = over;
                hero.style.cursor = over ? 'pointer' : '';
            }
        }

        // ---- Speech bubble follows the head ----
        if (bubble.classList.contains('show')) {
            head.getWorldPosition(tmp);
            tmp.y += 0.28;
            tmp.project(camera);
            const w = stage.clientWidth;
            const h = stage.clientHeight;
            const bw = bubble.offsetWidth;
            const bh = bubble.offsetHeight;
            const px = clamp((tmp.x + 1) / 2 * w + 14, 8, w - bw - 8);
            const py = clamp((1 - tmp.y) / 2 * h - bh, 8, h - bh - 8);
            bubble.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
        }

        // ---- HUD ----
        if (t > hudAt) {
            hudAt = t + 0.1;
            hudTarget.textContent = `${target.x.toFixed(2)}, ${(-target.z).toFixed(2)}`;
            hudGait.textContent = hopPhase !== 'none' ? 'HOP' : bootT < 1 ? 'STAND' : (swingPair !== -1 || speed > 0.05) ? 'TROT' : 'IDLE';
            hudMode.textContent = bootT < 1 ? 'BOOT' : wandering ? 'AUTO' : (t - lastPointer < 2.5 ? 'FOLLOW' : 'GOAL');
        }
    }

    function frame(now) {
        if (!running) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        update(dt);
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }

    bubble.classList.add('tracked');
    stage.classList.add('is-live');
    setRunning();

    return { hop };
}

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
let robot = null; // set once the 3D scene is live: { act() }

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
    if (robot) robot.act();
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

    // ----- Materials (site palette, not ANYbotics red) -----
    const M = {
        shell: new THREE.MeshStandardMaterial({ color: 0x1d2944, metalness: 0.45, roughness: 0.42 }),
        plate: new THREE.MeshStandardMaterial({ color: 0x31436b, metalness: 0.5, roughness: 0.32 }),
        dark: new THREE.MeshStandardMaterial({ color: 0x0a0f1c, metalness: 0.4, roughness: 0.55 }),
        glass: new THREE.MeshStandardMaterial({ color: 0x05080f, metalness: 0.9, roughness: 0.12 }),
        joint: new THREE.MeshStandardMaterial({ color: 0x141c2e, metalness: 0.75, roughness: 0.28 }),
        carbon: new THREE.MeshStandardMaterial({ color: 0x0c111c, metalness: 0.3, roughness: 0.35 }),
        rubber: new THREE.MeshStandardMaterial({ color: 0x07090f, metalness: 0.1, roughness: 0.9 }),
        blue: new THREE.MeshStandardMaterial({ color: 0x93c5fd, emissive: 0x3b82f6, emissiveIntensity: 2.4 }),
        blueDim: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, emissive: 0x3b82f6, emissiveIntensity: 0.7 }),
        amber: new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 2.0 }),
        led: new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 2.0 }),
        hit: new THREE.MeshBasicMaterial({ visible: false })
    };

    function mesh(geo, mat, cast = true) {
        const m = new THREE.Mesh(geo, mat);
        m.castShadow = cast;
        return m;
    }

    // Side profile (x/y) extruded across the body (z), with bevelled edges
    function extrude(shapeOrPoints, depth, bevel, curveSegments = 12) {
        const shape = Array.isArray(shapeOrPoints)
            ? new THREE.Shape(shapeOrPoints.map(([x, y]) => new THREE.Vector2(x, y)))
            : shapeOrPoints;
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments
        });
        geo.translate(0, 0, -depth / 2);
        return geo;
    }

    // Half of a rounded body cross-section (lateral u, vertical v), extruded along x.
    // top = true builds the upper half (v 0..h), false the lower half (v -h..0).
    function shellHalf(width, h, r, length, top) {
        const W = width / 2;
        const s = new THREE.Shape();
        if (top) {
            s.moveTo(-W, 0);
            s.lineTo(W, 0);
            s.lineTo(W, h - r);
            s.absarc(W - r, h - r, r, 0, Math.PI / 2, false);
            s.lineTo(-W + r, h);
            s.absarc(-W + r, h - r, r, Math.PI / 2, Math.PI, false);
        } else {
            s.moveTo(W, 0);
            s.lineTo(-W, 0);
            s.lineTo(-W, -h + r);
            s.absarc(-W + r, -h + r, r, Math.PI, Math.PI * 1.5, false);
            s.lineTo(W - r, -h);
            s.absarc(W - r, -h + r, r, Math.PI * 1.5, Math.PI * 2, false);
        }
        s.closePath();
        const geo = extrude(s, length, 0.006, 16);
        geo.rotateY(Math.PI / 2);   // depth now runs along x
        return geo;
    }

    // Rounded link from (0,0) radius r1 to (0,-len) radius r2, flat sides
    function linkGeo(r1, r2, len, depth, bevel) {
        const s = new THREE.Shape();
        s.moveTo(-r1, 0);
        s.absarc(0, 0, r1, Math.PI, 0, true);
        s.lineTo(r2, -len);
        s.absarc(0, -len, r2, 0, Math.PI, true);
        s.closePath();
        return extrude(s, depth, bevel, 16);
    }

    // Dog-bone thigh: round lobes at hip and knee joined by a pinched waist
    function thighGeo(r1, r2, len, waist, depth, bevel) {
        const s = new THREE.Shape();
        s.moveTo(-r1, 0);
        s.absarc(0, 0, r1, Math.PI, 0, true);
        s.quadraticCurveTo(waist, -len / 2, r2, -len);
        s.absarc(0, -len, r2, 0, Math.PI, true);
        s.quadraticCurveTo(-waist, -len / 2, -r1, 0);
        return extrude(s, depth, bevel, 18);
    }

    // Half-ellipse tube arch standing on the x/y plane (rails, cage hoops)
    function archGeo(rx, ry, tube) {
        const pts = [];
        for (let i = 0; i <= 24; i++) {
            const a = (i / 24) * Math.PI;
            pts.push(new THREE.Vector3(Math.cos(a) * rx, Math.sin(a) * ry, 0));
        }
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, tube, 8, false);
    }

    // ANYdrive actuator: r 0.045, 0.137 long, slight waist. Axis along x or z,
    // centred on the given point.
    function drive(axis) {
        const g = new THREE.Group();
        const can = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.137, 28), M.joint);
        const band = mesh(new THREE.CylinderGeometry(0.0465, 0.0465, 0.03, 28), M.dark, false);
        band.position.y = 0.035;
        g.add(can, band);
        if (axis === 'x') g.rotation.z = Math.PI / 2;
        else g.rotation.x = Math.PI / 2;
        return g;
    }

    // ----- Robot: ANYmal C proportions -----
    // Dimensions follow ANYbotics' open anymal_c_simple_description (BSD-3-Clause):
    // URDF joint origins plus extents measured from its meshes. Geometry here is
    // our own simplified rebuild; no meshes are shipped.
    // Body frame: +x forward, +y up, z across. The leg IK works in the x/y plane.
    const L1 = 0.285;                 // HFE -> KFE
    const SHANK_DX = 0.088;           // shank arm: foot tube sits this far ahead of the knee
    const SHANK_DY = 0.316;           // knee level -> foot ball centre
    const L2 = Math.hypot(SHANK_DX, SHANK_DY);
    const SHANK_BETA = Math.atan2(SHANK_DX, SHANK_DY);
    const FOOT_R = 0.031;
    const STAND_H = 0.52;             // HFE axis height when standing
    const HFE_X = 0.3598;
    const HFE_Z = 0.1878;
    const KFE_Z = 0.1003;             // knee is this far outboard of the HFE plane
    const SHANK_Z = KFE_Z + 0.013;    // foot tube plane, relative to the HFE plane
    const HAA_Z = 0.104;              // HAA axis (runs along x), lateral offset
    const HAA_X = 0.30;               // HAA output flange
    const LEG_OFF = HFE_Z - HAA_Z + SHANK_Z;   // HAA axis -> leg plane, 0.197
    // Feet are planted well inboard of the leg plane (0.301 at HAA = 0): the HAA
    // joints roll every leg inward (~11 deg standing), as ANYmal C walks.
    const STANCE_Z = 0.2;

    const root = new THREE.Group();     // position on the floor + heading
    const body = new THREE.Group();     // height, pitch, roll, posing yaw
    root.add(body);
    scene.add(root);

    // Shell: narrow waist, wide rounded ends over the HAA drives.
    // Upper halves in the lighter cover colour, lower halves darker.
    const waistTop = mesh(shellHalf(0.21, 0.083, 0.035, 0.34, true), M.plate);
    const waistBot = mesh(shellHalf(0.21, 0.1, 0.07, 0.34, false), M.shell);
    body.add(waistTop, waistBot);
    for (const sx of [-1, 1]) {
        const endTop = mesh(shellHalf(0.32, 0.1, 0.1, 0.15, true), M.plate);
        const endBot = mesh(shellHalf(0.32, 0.105, 0.075, 0.15, false), M.shell);
        endTop.position.x = endBot.position.x = sx * 0.235;
        body.add(endTop, endBot);

        // Hip gap between shell and face: inner frame + skid plate
        const frame = mesh(new THREE.BoxGeometry(0.11, 0.14, 0.14), M.dark);
        frame.position.set(sx * 0.362, 0.0, 0);
        const skid = mesh(new THREE.BoxGeometry(0.11, 0.03, 0.2), M.shell);
        skid.position.set(sx * 0.362, -0.085, 0);
        body.add(frame, skid);
    }

    // Docking hatch on the top cover
    const hatch = mesh(new THREE.BoxGeometry(0.184, 0.008, 0.13), M.dark, false);
    hatch.position.set(0.116, 0.085, 0);
    body.add(hatch);

    // Side depth cameras on the waist, tilted down
    for (const s of [-1, 1]) {
        const win = mesh(new THREE.BoxGeometry(0.094, 0.036, 0.008), M.glass, false);
        win.position.set(0, 0.022, s * 0.106);
        win.rotation.x = s * 0.5;
        body.add(win);
        for (const lx of [-0.024, 0.024]) {
            const lens = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 12), M.blueDim, false);
            lens.rotation.x = Math.PI / 2 + s * 0.5;
            lens.position.set(lx, 0.022, s * 0.11);
            body.add(lens);
        }
    }

    // Faces: measured side profile, steep under-slant for the downward depth camera
    const faceGeo = extrude([
        [0, 0.052], [0.03, 0.05], [0.055, 0.042], [0.088, 0.034], [0.091, 0.0],
        [0.075, -0.024], [0.052, -0.055], [0.035, -0.074], [0.02, -0.083], [-0.02, -0.084], [-0.02, 0.052]
    ], 0.25, 0.022);
    const eyes = new THREE.Group();   // front lenses, hidden briefly to "blink"
    function face(front) {
        const g = new THREE.Group();
        g.position.x = front ? 0.4145 : -0.4145;
        if (!front) g.rotation.y = Math.PI;
        g.add(mesh(faceGeo, M.shell));
        const lensMat = front ? M.blue : M.blueDim;

        // Upper glass band with the wide-angle camera
        const band = mesh(new THREE.BoxGeometry(0.006, 0.042, 0.19), M.glass, false);
        band.position.set(0.112, 0.022, 0);
        g.add(band);
        const wide = mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.006, 18), lensMat, false);
        wide.rotation.z = Math.PI / 2;
        wide.position.set(0.116, 0.02, 0);

        // Depth camera bar on the under-slant, pitched 30 degrees down
        const depth = new THREE.Group();
        depth.position.set(0.094, -0.052, 0);
        depth.rotation.z = -0.62;
        depth.add(mesh(new THREE.BoxGeometry(0.012, 0.034, 0.12), M.glass, false));
        for (const z of [-0.035, 0.035]) {
            const lens = mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.006, 14), lensMat, false);
            lens.rotation.z = Math.PI / 2;
            lens.position.set(0.006, 0, z);
            depth.add(lens);
        }
        if (front) eyes.add(wide, depth);
        else g.add(wide, depth);

        if (!front) {
            const tail = mesh(new THREE.BoxGeometry(0.006, 0.008, 0.12), M.amber, false);
            tail.position.set(0.112, 0.048, 0);
            g.add(tail);
        }
        body.add(g);
        return g;
    }
    const faceFront = face(true);
    faceFront.add(eyes);
    face(false);
    const eyeLight = new THREE.PointLight(0x60a5fa, 1.4, 2.2, 2);
    eyeLight.position.set(0.25, 0, 0);
    faceFront.add(eyeLight);

    // Carry handle over the front hip gap: two elliptical rails
    const railGeo = archGeo(0.05, 0.1, 0.009);
    for (const z of [-0.05, 0.05]) {
        const rail = mesh(railGeo, M.joint);
        rail.position.set(0.36, 0.07, z);
        body.add(rail);
    }

    // LiDAR in its cage over the rear hip gap (the puck spins)
    const cageBase = mesh(new THREE.CylinderGeometry(0.07, 0.072, 0.012, 24), M.joint);
    cageBase.position.set(-0.364, 0.076, 0);
    body.add(cageBase);
    const hoopLat = mesh(archGeo(0.066, 0.17, 0.007), M.joint);
    hoopLat.rotation.y = Math.PI / 2;
    hoopLat.position.set(-0.364, 0.076, 0);
    const hoopLong = mesh(archGeo(0.05, 0.17, 0.007), M.joint);
    hoopLong.position.set(-0.364, 0.076, 0);
    body.add(hoopLat, hoopLong);
    const lidarTop = new THREE.Group();
    lidarTop.position.set(-0.364, 0.1405, 0);
    const lidarCap = mesh(new THREE.CylinderGeometry(0.051, 0.051, 0.073, 28), M.plate);
    const lidarBand = mesh(new THREE.CylinderGeometry(0.0525, 0.0525, 0.02, 28), M.glass, false);
    const lidarEye = mesh(new THREE.BoxGeometry(0.008, 0.012, 0.03), M.blue, false);
    lidarEye.position.x = 0.052;
    lidarTop.add(lidarCap, lidarBand, lidarEye);
    body.add(lidarTop);

    // Radio module with antenna mast, blinking LED on top
    const radio = mesh(new THREE.BoxGeometry(0.161, 0.037, 0.098), M.dark);
    radio.position.set(-0.1635, 0.0915, 0);
    const mast = mesh(new THREE.CylinderGeometry(0.006, 0.009, 0.174, 10), M.joint);
    mast.position.set(-0.1, 0.197, 0);
    const tip = mesh(new THREE.SphereGeometry(0.011, 12, 12), M.led, false);
    tip.position.set(-0.1, 0.29, 0);
    body.add(radio, mast, tip);

    // Invisible hit box so clicks on thin legs still count
    const hitBox = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.85, 0.7), M.hit);
    hitBox.position.y = -0.15;
    body.add(hitBox);

    // Legs: LF, RF, LH, RH. Diagonal pairs step together (Lindy-hop rhythm).
    // kneeDir: +1 knee bends back and the shank arm points forward (front legs),
    // -1 the mirror (hind legs): ANYmal's X stance.
    const legDefs = [
        { x: HFE_X, s: -1, kneeDir: 1 },
        { x: HFE_X, s: 1, kneeDir: 1 },
        { x: -HFE_X, s: -1, kneeDir: -1 },
        { x: -HFE_X, s: 1, kneeDir: -1 }
    ];
    const pairs = [[0, 3], [1, 2]];

    const thighShape = thighGeo(0.063, 0.069, L1, 0.012, 0.05, 0.008);
    const tubeGeo = new THREE.CylinderGeometry(0.0175, 0.0175, SHANK_DY + 0.037, 12);
    const footGeo = new THREE.SphereGeometry(FOOT_R, 18, 18);
    const ringGeo = new THREE.TorusGeometry(0.036, 0.005, 6, 28);

    const legs = legDefs.map((d) => {
        const { s, kneeDir } = d;
        const sx = Math.sign(d.x);

        // HAA drive sits inside the shell bulge; its output flange faces the hip gap
        const haa = drive('x');
        haa.position.set(sx * 0.2315, 0, s * 0.104);
        body.add(haa);

        // Everything outboard of the HAA output rolls about the body's x axis
        const roll = new THREE.Group();
        roll.position.set(sx * HAA_X, 0, s * HAA_Z);
        body.add(roll);
        const flange = mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.012, 28), M.joint);
        flange.rotation.z = Math.PI / 2;
        flange.position.x = sx * 0.006;
        const haaRing = mesh(ringGeo, M.amber, false);
        haaRing.rotation.y = Math.PI / 2;
        haaRing.position.x = sx * 0.013;
        // Hip bracket joining the HAA output to the HFE drive
        const bracket = mesh(new THREE.BoxGeometry(0.03, 0.12, 0.09), M.plate);
        bracket.position.set(sx * 0.025, 0.005, s * 0.001);
        roll.add(flange, haaRing, bracket);

        const hip = new THREE.Group();
        hip.position.set(d.x - sx * HAA_X, 0, s * (HFE_Z - HAA_Z));
        roll.add(hip);
        // HFE drive runs inboard from the hip plane
        const hfe = drive('z');
        hfe.position.z = -s * 0.0684;
        hip.add(hfe);

        const thigh = new THREE.Group();
        hip.add(thigh);
        const thighMesh = mesh(thighShape, M.plate);
        thighMesh.position.z = s * 0.033;
        const hfeRing = mesh(ringGeo, M.amber, false);
        hfeRing.position.z = s * 0.068;
        thigh.add(thighMesh, hfeRing);

        const knee = new THREE.Group();
        knee.position.y = -L1;
        thigh.add(knee);
        const kfe = drive('z');
        kfe.position.z = s * 0.0318;
        knee.add(kfe);

        // L-shaped shank: arm from the knee, then a straight tube to the ball foot.
        // shankFrame turns it so the IK's straight knee->foot line lands on the ball.
        const shankFrame = new THREE.Group();
        shankFrame.rotation.z = -kneeDir * SHANK_BETA;
        knee.add(shankFrame);
        const arm = mesh(linkGeo(0.06, 0.045, SHANK_DX, 0.032, 0.008), M.plate);
        arm.rotation.z = kneeDir * Math.PI / 2;
        arm.position.z = s * (KFE_Z + 0.0085);
        const tube = mesh(tubeGeo, M.carbon);
        tube.position.set(kneeDir * SHANK_DX, (0.037 - SHANK_DY) / 2, s * SHANK_Z);
        const foot = mesh(footGeo, M.rubber);
        foot.position.set(kneeDir * SHANK_DX, -SHANK_DY, s * SHANK_Z);
        shankFrame.add(arm, tube, foot);

        return {
            hipLocal: hip.position.clone(),   // in the roll (HAA) frame
            homeX: d.x,
            footZ: s * STANCE_Z,
            s,
            roll,
            kneeDir,
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
    // Cursor following: the goal only moves when the cursor lands this far from it,
    // the robot sets off once the goal is FOLLOW_START away, and stops inside ARRIVE.
    const FOLLOW_MIN = 0.35;
    const FOLLOW_START = 0.3;
    const ARRIVE = 0.12;
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
    let poseYaw = 0;      // body posing toward the look point
    let posePitch = 0;
    let accelPitch = 0;
    let turnRoll = 0;
    // Lindy hop: swung step rhythm, kicks, bounce and sway
    let stepCount = 0;
    let kickLeg = -1;
    let sway = 0;
    let danceUntil = 0;
    let nextDance = 4;
    let walking = false;     // hysteresis: start beyond FOLLOW_START, stop inside ARRIVE
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
            tmp.set(leg.homeX, 0, leg.footZ);
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
        // Small cursor moves only turn its attention; it walks once the cursor
        // has moved a real distance from the current goal.
        const goal = clampToBounds(hit.clone());
        if (goal.distanceTo(target) > FOLLOW_MIN) target.copy(goal);
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

    // Click / ping: hop (every third hop spins)
    function act() {
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
        if (wandering && t > nextWander && t > danceUntil) {
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
        if (!grounded) walking = false;
        else if (dist > FOLLOW_START) walking = true;
        else if (dist < ARRIVE) walking = false;
        let facingViewer = false;
        if (walking) {
            const dyaw = wrapAngle(Math.atan2(-dz, dx) - yaw);
            desiredTurn = clamp(dyaw * 3.2, -2.4, 2.4);
            const facing = Math.max(0, Math.cos(dyaw));
            desiredSpeed = Math.min(1.15, dist * 1.7) * facing * facing;
        } else if (grounded) {
            // At the goal: turn on the spot to face the viewer
            const fyaw = wrapAngle(Math.atan2(-(camera.position.z - pos.z), camera.position.x - pos.x) - yaw);
            if (Math.abs(fyaw) > 0.06) desiredTurn = clamp(fyaw * 2.6, -1.8, 1.8);
            facingViewer = Math.abs(fyaw) <= 0.12;
        }
        const prevSpeed = speed;
        speed = damp(speed, desiredSpeed, 5, dt);
        yawRate = damp(yawRate, desiredTurn, 7, dt);
        yaw = wrapAngle(yaw + yawRate * dt);
        pos.x += Math.cos(yaw) * speed * dt;
        pos.z += -Math.sin(yaw) * speed * dt;
        clampToBounds(pos);
        const accel = (speed - prevSpeed) / Math.max(dt, 1e-3);

        // Standing around: now and then, a few bars of Lindy on the spot
        const still = grounded && !walking && facingViewer && speed < 0.05;
        if (!still) {
            nextDance = Math.max(nextDance, t + 3);
            danceUntil = Math.min(danceUntil, t);
        } else if (t > nextDance) {
            danceUntil = t + 4.2;
            nextDance = t + 11 + Math.random() * 7;
        }
        const dancing = still && t < danceUntil;

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

        // ---- Foot placement: Lindy-hop gait ----
        // Diagonal pairs still carry the robot, but on a swung (long-short) rhythm,
        // with a bounce on every step, a hip sway, and a kick every few counts.
        const baseDur = clamp(0.34 - speed * 0.1, 0.22, 0.34);
        swingDur = baseDur * (stepCount % 2 === 0 ? 1.2 : 0.8);
        computeHomes(baseDur * 0.6);

        let bob = 0;
        let swayTarget = 0;
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
            const threshold = dancing ? -1 : moving ? 0.025 : 0.05;
            const next = lastPair === 0 ? 1 : 0;
            if (errs[next] > threshold || errs[1 - next] > threshold) {
                swingPair = dancing || errs[next] >= errs[1 - next] * 0.4 ? next : 1 - next;
                swingT = 0;
                stepCount += 1;
                // Kick with the pair's front foot: every 4th count walking, every 2nd dancing
                kickLeg = stepCount % (dancing ? 2 : 4) === 0 ? pairs[swingPair].find((i) => i < 2) : -1;
                pairs[swingPair].forEach((i) => legs[i].start.copy(legs[i].foot));
            }
        }
        if (swingPair !== -1) {
            swingT += dt / swingDur;
            const s = Math.min(swingT, 1);
            const e = smooth(s);
            const arc = Math.sin(Math.PI * s);
            const lift = arc * clamp(0.06 + speed * 0.05, 0.06, 0.11);
            const fwdX = Math.cos(yaw);
            const fwdZ = -Math.sin(yaw);
            pairs[swingPair].forEach((i) => {
                const leg = legs[i];
                leg.foot.lerpVectors(leg.start, leg.home, e);
                leg.foot.y = FOOT_R + lift;
                if (i === kickLeg) {
                    // Lindy kick: flick the foot forward and up, back down on the count
                    const k = Math.sin(Math.PI * Math.min(s * 1.15, 1));
                    leg.foot.x += fwdX * 0.16 * k;
                    leg.foot.z += fwdZ * 0.16 * k;
                    leg.foot.y += 0.1 * k;
                }
            });
            bob = -arc * (dancing ? 0.045 : 0.03);   // bounce up mid-step, settle on the beat
            swayTarget = (swingPair === 0 ? 1 : -1) * arc;
            if (swingT >= 1) {
                lastPair = swingPair;
                swingPair = -1;
                kickLeg = -1;
            }
        }
        sway = damp(sway, swayTarget, 10, dt);


        // ---- Body pose ----
        const bootH = lerp(0.24, STAND_H, smooth(bootT));
        const breathe = Math.sin(t * 2.1) * 0.006 * (1 - Math.min(speed, 1));
        body.position.y = bootH - crouch - bob + breathe + hopY;
        // No head: like the real robot, it "looks" by posing its body with the feet planted
        root.worldToLocal(tmp.copy(lookPoint));
        tmp.y -= body.position.y;
        const calm = grounded ? 1 - Math.min(speed * 2.5, 1) : 0;
        poseYaw = damp(poseYaw, clamp(Math.atan2(-tmp.z, tmp.x), -1.2, 1.2) * 0.07 * calm, 4, dt);
        posePitch = damp(posePitch, clamp(Math.atan2(tmp.y, Math.hypot(tmp.x, tmp.z)), -0.5, 0.5) * 0.25 * calm, 4, dt);
        accelPitch = damp(accelPitch, clamp(-accel * 0.03, -0.08, 0.08) + (hopPhase === 'air' ? hopV * 0.03 : 0), 6, dt);
        turnRoll = damp(turnRoll, clamp(yawRate * speed * 0.09, -0.12, 0.12), 6, dt);
        // Lindy: hip sway and swivel
        body.rotation.y = poseYaw + sway * 0.05;
        body.rotation.z = accelPitch + posePitch;
        body.rotation.x = turnRoll + sway * 0.07;
        root.position.copy(pos);
        root.rotation.y = yaw + spin;
        root.updateMatrixWorld(true);

        // ---- Leg IK: HAA roll first, then the 2-bone HFE/KFE solve in the leg plane ----
        // (front knees bend back, hind knees forward)
        for (const leg of legs) {
            body.worldToLocal(tmp.copy(leg.foot));
            const dy = tmp.y - leg.roll.position.y;
            const dz = tmp.z - leg.roll.position.z;
            const r = Math.max(Math.hypot(dy, dz), LEG_OFF + 0.01);
            const depth = Math.sqrt(r * r - LEG_OFF * LEG_OFF);
            // Rolling by q about +x turns a downward vector by -q toward +z
            const q = Math.atan2(leg.s * LEG_OFF, depth) - Math.atan2(dz, -dy);
            leg.roll.rotation.x = clamp(q, -0.72, 0.72);
            leg.roll.updateMatrixWorld(true);
            leg.roll.worldToLocal(tmp.copy(leg.foot));
            const lx = tmp.x - leg.hipLocal.x;
            const ly = tmp.y - leg.hipLocal.y;
            const d = clamp(Math.hypot(lx, ly), 0.08, L1 + L2 - 0.002);
            const phi = Math.atan2(lx, -ly);
            const alpha = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
            const th1 = phi - leg.kneeDir * alpha;
            const kx = L1 * Math.sin(th1);
            const ky = -L1 * Math.cos(th1);
            // Foot along the clamped reach (keeps the shin pointing at the target)
            const fx = Math.sin(phi) * d;
            const fy = -Math.cos(phi) * d;
            const th2 = Math.atan2(fx - kx, -(fy - ky));
            leg.thigh.rotation.z = th1;
            leg.knee.rotation.z = th2 - th1;
        }

        // Blink
        if (t > blinkAt) {
            eyes.visible = false;
            if (t > blinkAt + 0.12) {
                eyes.visible = true;
                blinkAt = t + 2.5 + Math.random() * 3;
            }
        }

        // Details
        lidarTop.rotation.y += dt * 7;
        tip.material.emissiveIntensity = (Math.sin(t * 5) > 0.6) ? 3.2 : 0.4;

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

        // ---- Speech bubble follows the front face ----
        if (bubble.classList.contains('show')) {
            faceFront.getWorldPosition(tmp);
            tmp.y += 0.25;
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
            hudGait.textContent = hopPhase !== 'none' ? 'HOP' : bootT < 1 ? 'STAND' : (swingPair !== -1 || speed > 0.05) ? 'LINDY' : 'IDLE';
            hudMode.textContent = bootT < 1 ? 'BOOT' : dancing ? 'DANCE' : wandering ? 'AUTO' : (t - lastPointer < 2.5 ? 'FOLLOW' : 'GOAL');
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

    return { act };
}

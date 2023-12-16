
var moveDirection = { left: 0, right: 0, forward: 0, back: 0 }

var camera, clock, scene, renderer

var moveX = 0;
var moveZ = 0;
var stats;

setTimeout(() => {
    start()

}, 5000);

function start() {
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.updateProjectionMatrix()

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);


    //controls = new PointerLockControls(camera, renderer.domElement);

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    document.body.appendChild(renderer.domElement);


    setupPhysics()
    setupEventHandlers();

    clock = new THREE.Clock()

    ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);

    update()
}


function update() {
    delta = clock.getDelta()
    updatePhysics()
    renderer.render(scene, camera);
    requestAnimationFrame(update)
}


function handleKeyDown(event) {

    let keyCode = event.keyCode;

    //console.log(keyCode)


    switch (keyCode) {
        case 87: //W: FORWARD
            moveDirection.forward = 1
            break;

        case 83: //S: BACK
            moveDirection.back = 1
            break;

        case 65: //A: LEFT
            moveDirection.left = 1
            break;

        case 68: //D: RIGHT
            moveDirection.right = 1
            break;

    }

}

function handleKeyUp(event) {

    let keyCode = event.keyCode;

    switch (keyCode) {
        case 87: //FORWARD
            moveDirection.forward = 0
            break;

        case 83: //BACK
            moveDirection.back = 0
            break;

        case 65: //LEFT
            moveDirection.left = 0
            break;

        case 68: //RIGHT
            moveDirection.right = 0
            break;

    }

}


function windowResized() {
    resizeCanvas3D(windowWidth, windowHeight);
}

function setupEventHandlers() {
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);

    document.body.onmousedown = function (event) {
        if (event.button === 0) {
            mouseDown = true;
        } else if (event.button === 2) {
            aimDown = true
        }
    }
    document.body.onmouseup = function (event) {
        if (event.button === 0) {
            mouseDown = false;
        } else if (event.button === 2) {
            aimDown = false
        }
    }
}
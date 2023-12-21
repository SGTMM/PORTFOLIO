var camera, scene, renderer

var model, env_texture;

var plane = [null, null, null, null, null, null]

var texture2;

var manager;

var loading_icon = document.getElementsByClassName("loading-container")[0]

wait()

function wait() {
    if (typeof THREE === "undefined") { requestAnimationFrame(wait) } else { load_models() }
}

function load_models() {
    loader = new GLTFLoader()
    console.log("start")
    manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
        incrementProgress()
    };

    manager.onLoad = function () {
        console.log('Loading complete!');
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        //console.log('Loaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        incrementProgress()
    };

    manager.onError = function (url) {
        console.log('There was an error loading ' + url);
    };
    texture2 = new THREE.TextureLoader(manager).load("./env.jpg")
    texture2.mapping = THREE.EquirectangularReflectionMapping
    for (var i = 0; i < 6; i++) {
        const geometry = new THREE.PlaneGeometry(1, 0.7);
        var texture = new THREE.TextureLoader(manager).load(`./texture${i + 1}.png`);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = - 1
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.receiveShadow = false
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        material.receiveShadow = false
        plane[i] = new THREE.Mesh(geometry, material);
        plane[i].scale.z = -1
    }
    new THREE.ObjectLoader(manager).load("./scene_port.json", function (glb) {
        model = glb
        model.traverse(function (obj) {
            if (obj.isMesh) {
                obj.material.receiveShadow = true
                obj.material.castShadow = true
            }

        })

        setTimeout(() => {
            loading_icon.style.display = "none"
            start()
        }, 1000);

    })
    /*while (!loaded) {
        if (current_value !== prev_value) {
            prev_value = current_value
            incrementProgress()
        }
    }*/
}


function start() {
    scene = new THREE.Scene()

    scene.background = texture2
    scene.environment = texture2
    scene.fog = new THREE.Fog(0x000004, 0.5, 7)

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.updateProjectionMatrix()

    camera.position.set(-3, 2, 0)

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
    });

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true
    controls.enablePan = false
    controls.enableZoom = false
    controls.minAzimuthAngle = -Math.PI / 2
    controls.maxAzimuthAngle = Math.PI / 2
    controls.rotateSpeed = 0.1

    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;

    controls.target = new THREE.Vector3(0, 2, 0)

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);

    model.children[1].decay = 0.2

    scene.add(model)

    for (var i = 0; i < 6; i++) {
        scene.add(plane[i]);
    }

    update()
}


function update() {
    controls.update()
    camera.lookAt(new THREE.Vector3(0, 1, 0))
    for (var i = 0; i < 6; i++) {
        plane[i].position.x = Math.cos(controls.getAzimuthalAngle() - (Math.PI / 2) + (i) * -Math.PI / 2.5) * 1.5
        plane[i].position.z = Math.sin(controls.getAzimuthalAngle() - (Math.PI / 2) + (i) * -Math.PI / 2.5) * 1.5
        plane[i].position.y = controls.getAzimuthalAngle() + Math.PI - (i) * 0.65 + 0.2
        plane[i].lookAt(new THREE.Vector3(0, plane[i].position.y, 0))
    }
    renderer.render(scene, camera);
    requestAnimationFrame(update)
}

function incrementProgress() {
    const progressBar = document.getElementById("progress");
    const progressText = document.getElementById("progressText");

    // Get the current progress
    let currentProgress = parseFloat(progressBar.style.width) || 0;

    // Increment the progress by one division
    currentProgress += 1.69491525424;

    // Update the progress bar width
    progressBar.style.width = `${currentProgress}%`;

    // Update the progress text
    progressText.textContent = `Progress: ${currentProgress.toFixed(1)}%`;
}

document.getElementsByClassName("email-icon-container")[0].addEventListener("click", () => {
    copyToClipboard()
})

function copyToClipboard() {
    const email = "megamatteo27@gmail.com"; // Replace with your actual email address

    // Create a temporary input element
    const input = document.createElement("input");
    input.value = email;
    document.body.appendChild(input);

    // Select the text in the input element
    input.select();
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(input);

    // Provide acknowledgment to the user
    alert("Email copied to clipboard!");
}
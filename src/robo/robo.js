function checkAll() {
    4 === all && ($("#headerText").fadeOut(500, function() {}), action.run.play(), robo.position.z = -25.3, allLoaded = !0)
}

function init() {
    (container = document.getElementById("robo")), (camera = new THREE.PerspectiveCamera(50, 1, 1, 300)).position.z = 3, (scene = new THREE.Scene).background = new THREE.Color(0x0a0a0f), scene.fog = new THREE.Fog(0x0a0a0f, 10, 25);
    var e = new THREE.AmbientLight(1052688, 3);
    scene.add(e);
    var o = new THREE.SpotLight(16772829, 1, 100, .3, 0);
    o.position.set(-1, 2.5, 5), o.castShadow = !0, o.penumbra = .8, o.shadow.mapSize.width = 1024, o.shadow.mapSize.height = 1024, o.shadow.bias = .02, scene.add(o);
    var n = new THREE.TextureLoader,
        t = (new THREE.CubeTextureLoader).setPath("src/robo/").load(["met_up.jpg", "met_bk.jpg", "met_dn.jpg", "met_ft.jpg", "met_rt.jpg", "met_lf.jpg"]);
    t.format = THREE.RGBFormat;
    var i = new THREE.JSONLoader;
    i.load("src/robo/robo.json", function(e) {
        robo = new THREE.SkinnedMesh(e);
        var o = new THREE.Mesh(new THREE.PlaneGeometry(100, 100));
        o.rotation.x = -Math.PI / 2, robo.position.y = -1.3, robo.position.z = -25.3, o.position.y = -1.3, robo.material = new THREE.MeshStandardMaterial({
            map: n.load("src/robo/robo_color.jpg", function() {
                checkAll(all++)
            }),
            metalnessMap: n.load("src/robo/robo_metal_roughness.jpg", function() {
                checkAll(all++)
            }),
            normalMap: n.load("src/robo/robo_normal.jpg", function() {
                checkAll(all++)
            }),
            roughnessMap: n.load("src/robo/robo_metal_roughness.jpg", function() {
                checkAll(all++)
            }),
            envMap: t,
            skinning: !0
        }), o.material = new THREE.ShadowMaterial, o.material.opacity = .5, robo.castShadow = !0, o.receiveShadow = !0, scene.add(robo, o), mixer = new THREE.AnimationMixer(robo), action.breathe = mixer.clipAction(e.animations[0]), action.run = mixer.clipAction(e.animations[2]), action.stop = mixer.clipAction(e.animations[3]), action.breathe.setEffectiveWeight(1), action.run.setEffectiveWeight(1), action.stop.setEffectiveWeight(1), action.breathe.enabled = !0, action.run.enabled = !0, action.stop.enabled = !0, action.stop.loop = THREE.LoopOnce, action.stop.clampWhenFinished = !0, action.run.clampWhenFinished = !0, action.run.repetitions = 4, action.breathe.zeroSlopeAtStart = !1, action.breathe.zeroSlopeAtEnd = !1;
        var a;
        i.load("src/robo/hello.json", function(e) {
            uniforms = {
                colour: {
                    type: "c",
                    value: new THREE.Color(2457599)
                },
                rows: {
                    type: "f",
                    value: 35
                },
                glow: {
                    type: "f",
                    value: 4
                },
                glowRadius: {
                    type: "f",
                    value: 1
                },
                charDetail: {
                    type: "f",
                    value: .2
                },
                speed: {
                    type: "f",
                    value: 10
                },
                iGlobalTime: {
                    type: "f",
                    value: clock.getDelta(),
                    hidden: 1
                }
            };
            var o = `varying vec2 vUv;
                void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }`,
            n = `uniform vec3 colour;
            uniform float rows;
            uniform float glow;
            uniform float glowRadius;
            uniform float charDetail;
            uniform float speed;
            uniform float iGlobalTime;
            varying vec2 vUv;
            
            float random(in float x){
                return fract(sin(x)*43758.5453);
            }
            
            float random(in vec2 st){
                return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 23758.5453);
            }
            
            float randomChar(in vec2 outer,in vec2 inner){
                float grid = charDetail;
                vec2 margin = vec2(-.2,.05);
                float seed = 23.;
                vec2 borders = step(margin,inner)*step(margin,1.-inner);
                return step(.5,random(outer*seed+floor(inner*grid))) * borders.x * borders.y;
            }
            
            vec3 matrix(in vec2 st){
                vec2 ipos = floor(st*rows)+vec2(0.1,0.);
            
                ipos += vec2(.0,floor(iGlobalTime*speed*random(ipos.x)));
            
                vec2 fpos = fract(st*rows);
                vec2 center = (.5-fpos);
            
                float pct = random(ipos);
                float glowamount = (glowRadius-dot(center,center)*3.)*glow;
            
                return vec3(randomChar(ipos,fpos) * pct * glowamount) * colour;
            }
            
            void main() {
                gl_FragColor = vec4(matrix(vUv),0.27);
            }`,
            t = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: o,
                fragmentShader: n,
                blending: THREE.AdditiveBlending,
                transparent: !0,
                side: THREE.DoubleSide
            });
            (a = new THREE.Mesh(e, t)).rotateX(-Math.PI / 2), a.position.set(0, .5, -.47), a.visible = !1, a.name = "holoMesh", robo.children[0].children[0].add(a)
        }), $(function() {})
    }), renderer = new THREE.WebGLRenderer, renderer.setPixelRatio(2), window.innerWidth < window.innerHeight ? renderer.setSize(window.innerWidth, window.innerWidth) : renderer.setSize(container.offsetWidth, container.offsetHeight), container.appendChild(renderer.domElement), renderer.shadowMap.enabled = !0, renderer.shadowMap.type = THREE.PCFSoftShadowMap, renderer.toneMapping = THREE.Uncharted2ToneMapping, renderer.toneMappingExposure = 1.8, renderer.toneMappingWhitePoint = .6, renderer.gammaInput = !0, renderer.gammaOutput = !0, document.addEventListener("mousemove", onDocumentMouseMove, !1), window.addEventListener("resize", onWindowResize, !1), document.addEventListener("keydown", keyboard), gn.init().then(function() {
        gn.start(function(e) {
            robo && action.breathe.isRunning() && (gyroX = e.do.gamma, gyroY = e.do.beta)
        })
    })
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2, window.innerWidth < window.innerHeight ? renderer.setSize(window.innerWidth, window.innerWidth) : renderer.setSize(window.innerHeight, window.innerHeight)
}

function onDocumentMouseMove(e) {
    mouseX = (e.clientX - windowHalfX) / 200, mouseY = (e.clientY - windowHalfY) / 200
}

function keyboard(e) {
    32 == e.keyCode && (action.stop.play(), action.run.crossFadeTo(action.stop, .3), runSpeed = 0)
}

function animate() {
    render()
    requestAnimationFrame(animate)
}

function render() {
    if (mixer) {
        var e = Date.now();
        mixer.update(.001 * (e - prevTime)), .001 * (e - prevTime) < 100 && (delta = .001 * (e - prevTime)), prevTime = e
    }
    if (robo) {
        allLoaded && robo.translateZ(runSpeed * delta * 55), tick = !tick, 1 == allLoaded && 0 == action.run.isRunning() && 0 == action.breathe.isRunning() && (action.stop.play(), action.run.stop(), runSpeed = 0, stopping = !0), action.breathe.isRunning() && (robo.skeleton.bones[1].rotation.z -= .1 * (mouseX - camera.position.x) - .1, robo.skeleton.bones[1].rotation.x += .1 * (2 * mouseY - camera.position.y) + .4, robo.skeleton.bones[5].rotation.z += .1 * (mouseY - camera.position.y), robo.skeleton.bones[3].rotation.x += .1 * (mouseY - camera.position.y), robo.skeleton.bones[5].rotation.z += .1 * (mouseX - camera.position.x), robo.skeleton.bones[3].rotation.x += .1 * (mouseX - camera.position.x), robo.skeleton.bones[0].rotation.x += .03 * (mouseY - camera.position.y), robo.skeleton.bones[2].rotation.z -= ropelliX / 30, ropelliX++, uniforms.iGlobalTime.value = clock.getElapsedTime(), gyroX && gyroY && (robo.skeleton.bones[1].rotation.x += gyroY / 100 - .6, robo.skeleton.bones[1].rotation.z -= gyroX / 100, camera.position.x += .001 * gyroX, camera.position.y += .001 * gyroY));
        var o = robo.position.clone();
        o.y += .3, camera.lookAt(o)
    }
    stopping && (action.stop.isRunning() || (action.breathe.play(), stopping = !1, ropelliX = 0, scene.getObjectByName("holoMesh").visible = !0)), camera.position.x += .05 * (mouseX / 5 - camera.position.x), camera.position.y += .05 * (-mouseY / 20 - camera.position.y) + .1, renderer.render(scene, camera)
}
var container, camera, scene, renderer, mouseX = 0,
    mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,
    mixer, prevTime = Date.now(),
    action = {},
    activeActionName = "idle",
    runSpeed = .1,
    stopping = !1,
    robo, clock = new THREE.Clock,
    ropelliX, uniforms, gn = new GyroNorm,
    gyroX = 0,
    gyroY = 0,
    tick, all = 0,
    allLoaded = !1,
    delta,
    running = false

init()
animate()
running = true
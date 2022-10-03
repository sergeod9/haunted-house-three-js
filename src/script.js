import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const param = {toggleSpookyDoorLight}
gui.add(param, 'toggleSpookyDoorLight')

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#262837', 1, 12)
scene.fog = fog
/**
 * Textures
 */

// door texture
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorAOTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')

// walls texture
const wallsColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const wallsNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const wallsroughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')
const wallsAOTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')

// grass texture
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')
const grassAOTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
// check custom function at the end of the code
textureRepeatAndWrap(grassColorTexture, 8)
textureRepeatAndWrap(grassNormalTexture, 8)
textureRepeatAndWrap(grassRoughnessTexture, 8)
textureRepeatAndWrap(grassAOTexture, 8)
/**
 * House
 */
// house group
const house = new THREE.Group()
scene.add(house)

// walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,3,4),
    new THREE.MeshStandardMaterial({
        map: wallsColorTexture,
        normalMap: wallsNormalTexture,
        roughnessMap: wallsroughnessTexture,
        aoMap: wallsAOTexture,
        aoMapIntensity: 3
    })
)
cloneUV(walls) // check custom function at the end of the code
walls.position.y = walls.geometry.parameters.height /2
house.add(walls)

// roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.4, 1.5, 4),
    new THREE.MeshStandardMaterial({color: 0xb26050})
)
roof.position.y = (walls.geometry.parameters.height + roof.geometry.parameters.height /2)
roof.rotation.y = Math.PI / 4
house.add(roof)

// door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAOTexture,
        aoMapIntensity: 3,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
// This is for the ao map ... :'(
    // AO map requires a unique UV which could be a copy of the default UV !!!
cloneUV(door) // check custom function at the end of the code
door.position.y = 0.95
door.position.z = walls.geometry.parameters.depth /2 + 0.01
house.add(door)

// bushes
const bushGeometry = new THREE.SphereGeometry(1,16,8)
const bushMaterial = new THREE.MeshStandardMaterial({color: 0x669933})
    //bush 1
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.y = 0.3
bush1.position.z = 2.5
bush1.position.x = 2
bush1.scale.set(0.5,0.5,0.5)
    //bush 2
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.x = 1
bush2.position.y = 0.5
bush2.position.z = 2.8
bush2.scale.set(.75,.75,.75)
    //bush 3
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.position.set(-2, .3, 2.3)
bush3.scale.set(0.45, 0.4, 0.45)
    //bush4
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.position.set(-2.4, 0.1, 2.6)
bush4.scale.set(0.2, 0.2, 0.2)

house.add(bush1, bush2, bush3, bush4)

/**
 * Graves
 */
const graves = new THREE.Group()
scene.add(graves)
const graveMaterial = new THREE.MeshStandardMaterial({color: 0xb2b6b4})
for (let i = 0; i < 30; i++){
    const graveGeometry = new THREE.BoxGeometry(0.5, 1, 0.2)
    const angle = Math.random() * Math.PI *2
    let distance = (Math.random() * 4) + 4
    const x = Math.sin(angle) * distance
    const z = Math.cos(angle) * distance
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.35, z)
    grave.rotation.y = ( Math.random() - 0.5 )* Math.PI / 4
    grave.rotation.z = ( Math.random() - 0.5) * Math.PI /8
    const scaleX = (Math.random() - 0.1) + 0.9
    const scaleY = (Math.random() - 0.1) + 0.9
    grave.scale.set(scaleX, scaleY, 1)

    console.log(angle)
    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
        aoMap: grassAOTexture
     })
)
cloneUV(floor)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.05)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.05)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#aa7036', 1.5)
doorLight.distance = 7
doorLight.decay = 2
doorLight.position.set(0, 2.4, 3)
scene.add(doorLight)
/**
 * Sizes
 */

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
const ghost2 = new THREE.PointLight('#0000ff', 2, 3)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)

scene.add(ghost1, ghost2, ghost3)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 5
camera.position.y = 2
camera.position.z = 9
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
/**
 * Shadows
 */
moonLight.castShadow = true
doorLight.castShadow = true
// check custom function at the end of the code
// arguments: light object, shadow map size, far clipping
optimizeShadowMap(doorLight, 256, 7)

ghost1.castShadow = true
optimizeShadowMap(ghost1, 256, 7)
ghost2.castShadow = true
optimizeShadowMap(ghost2, 256, 7)
ghost3.castShadow = true
optimizeShadowMap(ghost3, 256, 7)

for (let item of house.children){
    item.castShadow = true
}
for (let grave of graves.children){
    grave.castShadow = true
}
floor.receiveShadow = true
renderer.shadowMap.enabled = true
// Make shadows soft
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()
let isDoorLightSpookey = true

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate door light distance
    const doorLightBlinkDelay = Math.floor((Math.random() + 0.8) * 3)
    const doorLightBlinkTimer =Math.floor(elapsedTime) % doorLightBlinkDelay === 0
    if ( doorLightBlinkTimer && isDoorLightSpookey){
        doorLight.distance = (Math.random()) * 10
    }

    // Animate Ghosts
    const ghostAngle1 = elapsedTime * 0.4
    const ghostAngle2 = elapsedTime * 0.3
    const ghostAngle3 = elapsedTime * 0.6
    // ghost 1 (purple)
    ghost1.position.x = Math.sin(ghostAngle1) * 4
    ghost1.position.z = Math.cos(ghostAngle1) * 4
    ghost1.position.y = Math.sin(ghostAngle1 * 3) 
    // ghost 2 
    ghost2.position.x = Math.cos(ghostAngle2) * 6
    ghost2.position.z = Math.sin(ghostAngle2) * 6
    ghost2.position.y = Math.sin(ghostAngle2 * 5 ) + Math.sin(elapsedTime * 2)
    // ghost 3
    ghost3.position.x = Math.cos(ghostAngle2) * 4
    ghost3.position.z = Math.sin(ghostAngle2) * 6
    ghost3.position.y = Math.sin(ghostAngle3 * 3 ) + Math.sin(elapsedTime)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

function toggleSpookyDoorLight(){
    doorLight.distance = 7
    isDoorLightSpookey = !isDoorLightSpookey
}

function cloneUV(obj){
    obj.geometry.setAttribute(
        'uv2',
        new THREE.Float32BufferAttribute(obj.geometry.attributes.uv.array, 2)
         )
}

function textureRepeatAndWrap(texture, factor){
    texture.repeat.set(factor, factor)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
}

function optimizeShadowMap(light, value, far){
    light.shadow.mapSize.width = value
    light.shadow.mapSize.height = value
    light.shadow.camera.far = far
}
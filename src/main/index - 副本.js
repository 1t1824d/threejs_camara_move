import * as THREE from 'three';
window.THREE = THREE
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
/* 
**
*/
let ContainerIDDiv = document.querySelector("#ContainerID")
let width = ContainerIDDiv.getBoundingClientRect().width
let height = ContainerIDDiv.getBoundingClientRect().height
console.log(`width,height`, width, height);
/* 
**
*/
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
camera.position.set(5, 5, 5)
camera.up = new THREE.Vector3(0, 1, 0)
scene.add(camera)

/* 
**
*/
let group = new THREE.Group()
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(geometry, material);
group.add(camera, cube)
scene.add(group);
/* 
**
*/
let ambientLight = new THREE.AmbientLight(0x404040, 1)
scene.add(ambientLight)
let spotLight = new THREE.SpotLight(0xffffff, 1)
spotLight.position.set(20, 20, 20)
scene.add(spotLight)
let directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 5, 0)
directionalLight.castShadow = true
//设置阴影边缘模糊度
directionalLight.shadow.radius = 20
//设置阴影分辨率
directionalLight.shadow.mapSize.set(4096, 4096)
scene.add(directionalLight)
/* 
**
*/
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true
renderer.setSize(width, height)
ContainerIDDiv.appendChild(renderer.domElement);
/* 
**
*/
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
// const helper = new THREE.CameraHelper(camera);
// scene.add(helper);
const gridHelper = new THREE.GridHelper(1000, 1000);
scene.add(gridHelper);
/* 
**
*/
function render() {
    requestAnimationFrame(render);
    group.position.x += 0.1
    camera.position.x = cube.position.x + 5
    camera.lookAt(cube.position)
    renderer.render(scene, camera)
    controls.update()
}
render();
/* 
**
*/
window.addEventListener("resize", () => {
    width = ContainerIDDiv.getBoundingClientRect().width
    height = ContainerIDDiv.getBoundingClientRect().height
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)

})
window.addEventListener("dblclick", () => {
    let fullscreen = document.fullscreenElement
    if (!fullscreen) {
        renderer.domElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})

/*
**
*/

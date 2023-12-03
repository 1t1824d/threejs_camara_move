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
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 2;
camera.position.y = 2;
/* 
**
*/
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);
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
const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);
/* 
**
*/
function render() {
    requestAnimationFrame(render);
    // 更新相机位置
    camera.position.x += 0.01;
    camera.position.z += 0.01;
    camera.lookAt(cube.position)
    // 更新模型位置和朝向
    cube.position.x = camera.position.x;
    cube.position.y = camera.position.y;
    cube.rotation.z = camera.rotation.z;

    // 渲染场景
    renderer.render(scene, camera);
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




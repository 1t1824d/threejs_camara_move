import * as THREE from 'three';
window.THREE = THREE
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000000);
camera.position.set(-10000, 1000, -10000)
/* 
**
*/
let ambientLight = new THREE.AmbientLight(0xffffff, 0.51)
scene.add(ambientLight)
let spotLight = new THREE.SpotLight(0xffffff, 0.51)
spotLight.position.set(10000, 10000, 1000)
scene.add(spotLight)
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.51)
directionalLight.position.set(0, 10000, 0)
directionalLight.castShadow = true
//设置阴影边缘模糊度
directionalLight.shadow.radius = 20
//设置阴影分辨率
directionalLight.shadow.mapSize.set(4096, 4096)
scene.add(directionalLight)
/* 
**
*/
const points = [
    new THREE.Vector3(-1000, -5000, -5000),
    new THREE.Vector3(1000, -5000, 0),
    new THREE.Vector3(1800, 800, 1000),
    new THREE.Vector3(800, 5000, 5000),
    new THREE.Vector3(0, 0, 10000)
];
// 通过类CatmullRomCurve3创建一个3D样条曲线
let curve = new THREE.CatmullRomCurve3(points);
const material = new THREE.LineBasicMaterial({
    color: 0xff00ff
});
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
scene.add(line);
//管道体
const tubeGeometry = new THREE.TubeGeometry(curve, 100, 500, 30); // 101取点数 3为r 30为三角切面数
const tubeMesh = new THREE.Mesh(tubeGeometry, new THREE.MeshBasicMaterial({
    color: "#00aa00",
    side: THREE.DoubleSide,
    wireframe: true
}))
scene.add(tubeMesh)
// 引用GLTFLoader.js文件，加载模型
let mesh
let loader = new GLTFLoader();
loader.load(require('../assets/models/客机.glb'), (result) => {
    mesh = result.scene;
    console.log(`mesh`, mesh);
    mesh.scale.set(50, 50, 50)
    mesh.position.set(-1000, -5000, -5000);
    scene.add(mesh);
});

/* 
**
*/
const renderer = new THREE.WebGLRenderer(
    {
        antialias: true,
        logarithmicDepthBuffer: true
    }
);
renderer.shadowMap.enabled = true
renderer.setClearColor(new THREE.Color('rgba(2, 29, 50, 0.80)'))
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
let clock = new THREE.Clock(); //声明一个时钟对象
const loopTime = 10 * 1000; // loopTime: 循环一圈的时间
function render() {
    requestAnimationFrame(render);
    if (curve) {
        let time = Date.now();
        let t = (time % loopTime) / loopTime; // 计算当前时间进度百分比
        changeLookAt(t);
    }
    renderer.render(scene, camera);
    controls.update()
}
render();
function changeLookAt(t) {
    if (!mesh) return
    // 当前点在线条上的位置
    const position = curve.getPointAt(t);
    let nPos = new THREE.Vector3(position.x, position.y - 100, position.z);
    mesh.position.copy(nPos);
    // 返回点t在曲线上位置切线向量
    const tangent = curve.getTangentAt(t);
    // 位置向量和切线向量相加即为所需朝向的点向量
    const lookAtVec = tangent.add(nPos);
    mesh.lookAt(lookAtVec);
    if (t > 0.03) {
        let pos = curve.getPointAt(t - 0.03);
        camera.position.copy(pos);
        camera.lookAt(position)
    }
}
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




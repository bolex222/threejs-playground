import { CameraHelper, PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import screenManger from "../screenManager";
import gui from "../gui/gui";
import GUI, { OptionController } from "lil-gui";
import { ISheet, types } from "@theatre/core";
import animationManager from "./theatre";

const VIEWPORT_CAMERA = "viewport camera";
type CameraStruct = {
  camera: PerspectiveCamera;
  name: string;
  debugger: CameraHelper;
};

class CameraController {
  private viewPortCamera: PerspectiveCamera;
  public currentCamera: PerspectiveCamera;
  private orbitControls: OrbitControls;
  private scene: Scene;
  private cameras: Array<CameraStruct> = [];
  private guiObj = {
    "current camera": VIEWPORT_CAMERA,
    "add camera": () => {},
  };
  private cameraChoises: Array<string> = [VIEWPORT_CAMERA];
  private guiFolder: GUI | undefined = undefined;
  private guiCameraSelector: OptionController | undefined = undefined;

  constructor(canvas: HTMLCanvasElement, scene: Scene) {
    this.viewPortCamera = new PerspectiveCamera();
    this.viewPortCamera.position.set(0, 5, 5);
    this.viewPortCamera.lookAt(0, 0, 0);
    this.currentCamera = this.viewPortCamera;
    this.orbitControls = new OrbitControls(this.viewPortCamera, canvas);
    this.scene = scene;
    screenManger.subscribe(this.handleResize);
    this.setUpGui();
  }

  handleResize = (width: number, height: number) => {
    this.viewPortCamera.aspect = width / height;
    this.viewPortCamera.updateProjectionMatrix();
    for (const camera of this.cameras) {
      camera.camera.aspect = width / height;
      camera.camera.updateProjectionMatrix();
    }
  };

  addCamera = () => {
    const newCamera = new PerspectiveCamera(
      75,
      screenManger.width / screenManger.height,
      0.1,
      100,
    );
    const cameraHelper = new CameraHelper(newCamera);
    this.scene.add(cameraHelper);
    const cameraBuffer = {
      camera: newCamera,
      name: `camera #${this.cameras.length + 1}`,
      debugger: cameraHelper,
    };
    this.cameras.push(cameraBuffer);
    this.cameraChoises.push(cameraBuffer.name);

    if (this.guiCameraSelector) {
      this.guiCameraSelector.$select.innerHTML += `<option>${cameraBuffer.name}</option>`;
    }

    this.addCameraToMainSheet(cameraBuffer);
  };

  addCameraToMainSheet = (cameraBuffer: CameraStruct) => {
    const mainSheet = animationManager.getSheetByName("main");
    if (!mainSheet) return;
    const animationCamera = mainSheet.object(cameraBuffer.name, {
      location: types.compound({
        x: types.number(cameraBuffer.camera.position.x),
        y: types.number(cameraBuffer.camera.position.y),
        z: types.number(cameraBuffer.camera.position.z),
      }),
      rotation: types.compound({
        x: types.number(cameraBuffer.camera.rotation.x, { range: [-2, 2] }),
        y: types.number(cameraBuffer.camera.rotation.y, { range: [-2, 2] }),
        z: types.number(cameraBuffer.camera.rotation.z, { range: [-2, 2] }),
      }),
      zoom: types.compound({
        value: types.number(cameraBuffer.camera.zoom),
      }),
    });
    animationCamera.onValuesChange((values) => {
      cameraBuffer.camera.position.set(
        values.location.x,
        values.location.y,
        values.location.z,
      );
      cameraBuffer.camera.rotation.set(
        values.rotation.x * Math.PI,
        values.rotation.y * Math.PI,
        values.rotation.z * Math.PI,
      );

      cameraBuffer.camera.zoom = values.zoom.value;

      cameraBuffer.camera.updateMatrixWorld();
      cameraBuffer.debugger.update();
    });
  };

  changeCamera = (cameraName: string) => {
    if (cameraName === VIEWPORT_CAMERA) {
      this.orbitControls.enabled = true;
      this.currentCamera = this.viewPortCamera;
      return;
    }

    this.orbitControls.enabled = false;
    const selectedCamera = this.cameras.find(({ name }) => name === cameraName);
    if (selectedCamera) {
      this.currentCamera = selectedCamera.camera;
    }
  };

  setUpGui = () => {
    this.guiObj = {
      "current camera": VIEWPORT_CAMERA,
      "add camera": this.addCamera,
    };
    this.guiFolder = gui.addFolder("Cameras");
    this.guiFolder.close();
    this.guiCameraSelector = this.guiFolder
      .add(this.guiObj, "current camera", this.cameraChoises)
      .onChange(this.changeCamera) as OptionController;
    this.guiFolder.add(this.guiObj, "add camera");
  };

  tick() {
    if (this.currentCamera === this.viewPortCamera) {
      this.orbitControls.update();
    }
    for (const camera of this.cameras) {
      camera.debugger.update();
    }
  }
}

export default CameraController;

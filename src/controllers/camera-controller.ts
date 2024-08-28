import { CameraHelper, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import screenManger from "../view/screenManager";
import editorsWorld from "../models/EditorsWorld";
import Environement3DElement from "../models/Environement3DElements";
import screen from "../view/screenManager";
import EditorCamera from "../models/models/editor-camera";
import { addCameraToAllSheet } from "./animation-controller";

const VIEWPORT_CAMERA = "viewport camera";

export const createCamera = () => {
  const newCamera = new PerspectiveCamera(
    75,
    screenManger.width / screenManger.height,
    0.1,
    100,
  );
  const cameraHelper = new CameraHelper(newCamera);
  editorsWorld.scene.add(cameraHelper);
  const editorsRelativeElement = new Environement3DElement(cameraHelper);
  editorsWorld.editorRelative3DElements.push(editorsRelativeElement);
  const cameraBuffer = new EditorCamera(
    newCamera,
    `camera #${editorsWorld.camera.cameras.length + 1}`,
    cameraHelper,
  );
  editorsWorld.camera.cameras.push(cameraBuffer);
  editorsWorld.camera.cameraChoises.push(cameraBuffer.name);

  if (editorsWorld.camera.guiCameraSelector) {
    editorsWorld.camera.guiCameraSelector.$select.innerHTML += `<option>${cameraBuffer.name}</option>`;
  }
  addCameraToAllSheet(cameraBuffer);
};

const handleScreenResize = (width: number, height: number) => {
  editorsWorld.camera.viewPortCamera.aspect = width / height;
  editorsWorld.camera.viewPortCamera.updateProjectionMatrix();
  for (const camera of editorsWorld.camera.cameras) {
    camera.camera.aspect = width / height;
    camera.camera.updateProjectionMatrix();
  }
};

export const setUpCameraManagment = (
  camera: PerspectiveCamera,
  canvas: HTMLElement,
) => {
  editorsWorld.camera.orbitControls = new OrbitControls(camera, canvas);
  screen.subscribe(handleScreenResize);
};

export const changeCamera = (cameraName: string) => {
  if (cameraName === VIEWPORT_CAMERA) {
    editorsWorld.camera.currentCamera = editorsWorld.camera.viewPortCamera;

    if (editorsWorld.camera.orbitControls) {
      editorsWorld.camera.orbitControls.enabled = true;
    }
    return;
  }

  if (editorsWorld.camera.orbitControls) {
    editorsWorld.camera.orbitControls.enabled = false;
  }
  const selectedCamera = editorsWorld.camera.cameras.find(
    ({ name }) => name === cameraName,
  );
  if (selectedCamera) {
    editorsWorld.camera.currentCamera = selectedCamera.camera;
  }
};

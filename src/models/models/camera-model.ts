import { OptionController } from "lil-gui";
import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import EditorCamera from "./editor-camera";

export const VIEWPORT_CAMERA = "viewport camera";

class CameraModel {
  public viewPortCamera: PerspectiveCamera;
  public currentCamera: PerspectiveCamera;
  public orbitControls: OrbitControls | null = null;
  public cameras: Array<EditorCamera> = [];
  public guiObj = {
    "current camera": VIEWPORT_CAMERA,
    "add camera": () => {},
  };
  public cameraChoises: Array<string> = [VIEWPORT_CAMERA];
  public guiCameraSelector: OptionController | null = null;

  constructor() {
    this.viewPortCamera = new PerspectiveCamera();
    this.viewPortCamera.position.set(5, 5, 5);
    this.viewPortCamera.lookAt(0, 0, 0);
    this.currentCamera = this.viewPortCamera;
  }
}

export default CameraModel;

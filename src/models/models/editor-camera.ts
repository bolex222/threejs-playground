import { ISheet, ISheetObject, types } from "@theatre/core";
import { CameraHelper, PerspectiveCamera } from "three";

class EditorCamera {
  camera: PerspectiveCamera;
  name: string;
  cameraHelper: CameraHelper;

  constructor(
    camera: PerspectiveCamera,
    name: string,
    cameraHelper: CameraHelper,
  ) {
    this.cameraHelper = cameraHelper;
    this.camera = camera;
    this.name = name;
  }

  convertToAnimationObject = (sheet: ISheet): ISheetObject<any> => {
    const animationCamera = sheet.object(this.name, {
      location: types.compound({
        x: types.number(this.camera.position.x),
        y: types.number(this.camera.position.y),
        z: types.number(this.camera.position.z),
      }),
      rotation: types.compound({
        x: types.number(this.camera.rotation.x, { range: [-2, 2] }),
        y: types.number(this.camera.rotation.y, { range: [-2, 2] }),
        z: types.number(this.camera.rotation.z, { range: [-2, 2] }),
      }),
      zoom: types.compound({
        value: types.number(this.camera.zoom),
      }),
    });
    animationCamera.onValuesChange((values) => {
      this.camera.position.set(
        values.location.x,
        values.location.y,
        values.location.z,
      );
      this.camera.rotation.set(
        values.rotation.x * Math.PI,
        values.rotation.y * Math.PI,
        values.rotation.z * Math.PI,
      );

      this.camera.zoom = values.zoom.value;

      this.camera.updateMatrixWorld();
      this.cameraHelper.update();
    });
    return animationCamera;
  };
}

export default EditorCamera;

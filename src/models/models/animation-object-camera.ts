import { ISheetObject } from "@theatre/core";
import { Camera } from "three";
import EditorCamera from "./editor-camera";

class AnimationObjectCamera {
  basic3dElement: EditorCamera;
  animationObject: ISheetObject;

  constructor(camera: EditorCamera, sheetObejct: ISheetObject) {
    this.basic3dElement = camera;
    this.animationObject = sheetObejct;
  }
}

export default AnimationObjectCamera;

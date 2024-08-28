import { ISheetObject } from "@theatre/core";
import Basic3dElement from "../Basic3DElement";

class AnimationObjectElement {
  basic3dElement: Basic3dElement;
  animationObject: ISheetObject;

  constructor(basic3dElement: Basic3dElement, sheetObejct: ISheetObject) {
    this.basic3dElement = basic3dElement;
    this.animationObject = sheetObejct;
  }
}

export default AnimationObjectElement;

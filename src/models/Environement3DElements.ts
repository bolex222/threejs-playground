import { Object3D } from "three";

class Environement3DElement {
  object: Object3D;

  private _globallyVisible: boolean = true;
  private _locallyVisible: boolean = true;

  constructor(object: Object3D) {
    this.object = object;
  }

  set globallyVisible(value: boolean) {
    this._globallyVisible = value;
    this.object.visible = this._locallyVisible && this._globallyVisible;
  }
  set locallyVisible(value: boolean) {
    this._locallyVisible = value;
    this.object.visible = this._locallyVisible && this._globallyVisible;
  }
}

export default Environement3DElement;

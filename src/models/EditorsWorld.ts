import { Scene, Color } from "three";
import Basic3dElement, { RenderModeOptions } from "./Basic3DElement";
import Environement3DElement from "./Environement3DElements";

class EditorsWorld {
  public scene: Scene;
  public basic3dElements: Array<Basic3dElement> = [];
  public editorRelative3DElements: Array<Environement3DElement> = [];
  public editorsEnvironementVisible: boolean = true;
  public renderMode: RenderModeOptions = "workbench";

  constructor() {
    this.scene = new Scene();
    this.scene.background = new Color("#37323E");
  }

  set visibleEditorEnvironement(value: boolean) {
    this.editorsEnvironementVisible = value;
    for (const envElement of this.editorRelative3DElements) {
      envElement.globallyVisible = this.editorsEnvironementVisible;
    }
  }
}

const editorsWorld = new EditorsWorld();
export default editorsWorld;

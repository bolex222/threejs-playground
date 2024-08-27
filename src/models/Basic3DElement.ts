import { Material, Mesh, Object3D } from "three";
import materialLibrary from "./materials-library";
export type RenderModeOptions = "workbench" | "wireframe" | "default";

class MaterialBackup {
  uuid: string;
  object: Mesh;
  sourceMaterial: Material | Array<Material>;

  constructor(object: Mesh) {
    this.object = object;
    this.uuid = object.uuid;
    this.sourceMaterial = this.object.material;
  }

  useSourceMaterial = () => {
    this.object.material = this.sourceMaterial;
  };

  setCustomMaterial = (material: Material | Array<Material>) => {
    this.object.material = material;
  };
}

class Basic3dElement {
  public object: Object3D;
  private materialBackups: Array<MaterialBackup> = [];

  constructor(object3d: Object3D) {
    this.object = object3d;
    this.backupMaterials();
  }

  backupMaterials = () => {
    this.materialBackups = [];
    if (this.object instanceof Mesh) {
      const backup = new MaterialBackup(this.object);
      this.materialBackups.push(backup);
    }
    this.object.traverse((object) => {
      if (object instanceof Mesh) {
        const backup = new MaterialBackup(object);
        this.materialBackups.push(backup);
      }
    });
  };

  set renderMode(value: RenderModeOptions) {
    for (const backup of this.materialBackups) {
      switch (value) {
        case "workbench":
          backup.object.material = materialLibrary.workbench;
          break;
        case "wireframe":
          backup.object.material = materialLibrary.wireframe;
          break;
        default:
          backup.object.material = backup.sourceMaterial;
          break;
      }
    }
  }
}

export default Basic3dElement;

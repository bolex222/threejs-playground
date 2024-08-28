import { Material, Mesh, Object3D } from "three";
import materialLibrary from "./materials-library";
import { ISheetObject, ISheet, types } from "@theatre/core";
export type RenderModeOptions = "workbench" | "wireframe" | "default";

class MaterialBackup {
  public uuid: string;
  public object: Mesh;
  public sourceMaterial: Material | Array<Material>;

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

  convertToAnimationObject = (animationSheet: ISheet): ISheetObject<any> => {
    const animationObjectBuffer = animationSheet.object(this.object.name, {
      location: types.compound({
        x: types.number(this.object.position.x),
        y: types.number(this.object.position.y),
        z: types.number(this.object.position.z),
      }),
      rotation: types.compound({
        x: types.number(this.object.rotation.x),
        y: types.number(this.object.rotation.y),
        z: types.number(this.object.rotation.z),
      }),
      scale: types.compound({
        x: types.number(this.object.scale.x),
        y: types.number(this.object.scale.y),
        z: types.number(this.object.scale.z),
      }),
    });
    animationObjectBuffer.onValuesChange((values) => {
      const { location, rotation, scale } = values;
      const { PI } = Math;
      this.object.position.set(location.x, location.y, location.z);
      this.object.rotation.set(
        rotation.x * PI,
        rotation.y * PI,
        rotation.z * PI,
      );
      this.object.scale.set(scale.x, scale.y, scale.z);
    });
    return animationObjectBuffer;
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

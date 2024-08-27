import {
  MeshBasicMaterial,
  MeshMatcapMaterial,
  Texture,
  TextureLoader,
} from "three";

class MaterialLibrary {
  workbench: MeshMatcapMaterial;
  wireframe: MeshBasicMaterial;

  constructor() {
    this.workbench = new MeshMatcapMaterial();
    this.wireframe = new MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
    });
  }

  loadMatcapMaterial = async () => {
    const textureLoader = new TextureLoader();
    const result = await new Promise<Texture>((resolve, reject) => {
      textureLoader.load(
        "/matcaps/basic_blender_matcap.jpg",
        (texture) => {
          resolve(texture);
        },
        () => { },
        () => {
          reject();
        },
      );
    }).catch(() => new Error());
    if (result instanceof Error) return;
    this.workbench.matcap = result;
  };
}

const materialLibrary = new MaterialLibrary();
export default materialLibrary;

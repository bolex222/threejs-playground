import { Group, Object3DEventMap } from "three";

export const parseGlbFile = async (
  fileContent: ArrayBuffer | string,
  filename: string,
): Promise<Group<Object3DEventMap>> => {
  const DracoWrapperBuffer = await import(
    "three/examples/jsm/loaders/DRACOLoader.js"
  ).catch(() => new Error("Editor could not load threejs Draco loader"));
  if (DracoWrapperBuffer instanceof Error) {
    throw DracoWrapperBuffer;
  }

  const GltfLoaderWrapper = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  ).catch(() => new Error("Editor could not load threejs gltf loader"));
  if (GltfLoaderWrapper instanceof Error) {
    throw GltfLoaderWrapper;
  }

  const { DRACOLoader } = DracoWrapperBuffer;
  const { GLTFLoader } = GltfLoaderWrapper;

  const dracoLoader = new DRACOLoader();
  dracoLoader.setPath("/libs/draco/gltf/");
  const loader = new GLTFLoader();

  loader.setDRACOLoader(dracoLoader);
  return new Promise<Group<Object3DEventMap>>((resolve, reject) => {
    try {
      loader.parse(
        fileContent,
        "",
        (result) => {
          const { scene, animations } = result;
          scene.name = filename;
          scene.animations.push(...animations);
          resolve(scene);
        },
        () => {
          reject(new Error("Impossible to parse the glb file"));
        },
      );
    } catch (_) {
      throw new Error("Impossible to parse the glb file bis");
    }
  });
};

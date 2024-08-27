import {
  Scene,
  WebGLRenderer,
  Group,
  TextureLoader,
  Texture,
  AmbientLight,
} from "three";
import { ExperienceSetter } from "./core/ExperienceSetter";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import animationController from "./controllers/animation-controller";
import { types } from "@theatre/core";
import CameraController from "./controllers/camera-controller";

export class Experience extends ExperienceSetter {
  private group: Group;
  private cameraController: CameraController;

  constructor(
    renderer: WebGLRenderer,
    canvas: HTMLCanvasElement,
    scene: Scene,
    cameraController: CameraController,
  ) {
    super(renderer, canvas, scene);
    this.main();
    this.group = new Group();
    this.scene.add(this.group);
    this.cameraController = cameraController;
  }

  async main() {
    // const ambiantLight = new AmbientLight();
    // this.scene.add(ambiantLight);
    // const helmetGroup = await this.loadDamagedHElmet();
    // const sheet = animationController.getSheetByName("main");
    // if (sheet) {
    //   const elemObject = sheet.object("helmet", {
    //     location: types.compound({
    //       x: types.number(helmetGroup.position.x),
    //       y: types.number(helmetGroup.position.y),
    //       z: types.number(helmetGroup.position.z),
    //     }),
    //     rotation: types.compound({
    //       x: types.number(helmetGroup.rotation.x),
    //       y: types.number(helmetGroup.rotation.y),
    //       z: types.number(helmetGroup.rotation.z),
    //     }),
    //     scale: types.compound({
    //       x: types.number(helmetGroup.scale.x),
    //       y: types.number(helmetGroup.scale.y),
    //       z: types.number(helmetGroup.scale.z),
    //     }),
    //   });
    //   elemObject.onValuesChange((values) => {
    //     const { location, rotation, scale } = values;
    //     helmetGroup.position.set(location.x, location.y, location.z);
    //     helmetGroup.rotation.set(rotation.x, rotation.y, rotation.z);
    //     helmetGroup.scale.set(scale.x, scale.y, scale.z);
    //   });
    // }
  }

  loadDamagedHElmet = async (): Promise<Group> => {
    const loader = new GLTFLoader();
    return new Promise((resolve) =>
      loader.load(
        "/gltf/DamagedHelmet/DamagedHelmet.gltf",
        async (gltf) => {
          const model = gltf.scene;
          await this.renderer.compileAsync(
            model,
            this.cameraController.currentCamera,
            this.scene,
          );
          this.scene.add(model);
          model.position.set(0, 1, 0);
          resolve(model);
        },
        () => {},
        (e) => {
          console.error(e);
        },
      ),
    );
  };

  loadTexture = async (path: string): Promise<Texture> => {
    const tl = new TextureLoader();
    return new Promise((resolve, reject) => {
      tl.load(
        path,
        (texture) => {
          resolve(texture);
        },
        () => {},
        () => {
          reject();
        },
      );
    });
  };

  tick = (_: number, delta: number, frame: number) => {
    if (this.group) {
      this.group.rotation.set(
        this.group.rotation.x,
        this.group.rotation.y + delta / 1000,
        0,
      );
    }
  };
}

import "../style.css";
import "toastify-js/src/toastify.css";

type BackupObjMat = Array<{ uid: string; mat: Material }>;

import {
  AxesHelper,
  Color,
  Mesh,
  Scene,
  WebGLRenderer,
  TextureLoader,
  Texture,
  Material,
  MeshMatcapMaterial,
} from "three";
import ticker from "../ticker";
import screen from "../screenManager";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import TerrainPlane from "../terrainPlane/terrainPlan";
import gui from "../gui/gui";
import { Experience } from "../main";
import CameraController from "./CameraController";
import animationManager from "./theatre";
import { ISheet } from "@theatre/core";

class Entry {
  private cameraController: CameraController;
  private renderer: WebGLRenderer;
  private mainScene: Scene;
  private canvas: HTMLCanvasElement;
  private orbitControls: OrbitControls | null = null;
  private experience: Experience;
  private basicMatcapTexture: Material | undefined = undefined;
  private backupMaterials: BackupObjMat = [];
  private matcapIgnored: Array<string> = [];
  private guiOpt = {
    orbitControls: true,
    "workbench shading": false,
  };
  private mainSheetAnimation: ISheet;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.mainSheetAnimation = animationManager.createSheet("main");

    this.mainScene = new Scene();
    this.cameraController = new CameraController(
      this.renderer.domElement,
      this.mainScene,
      this.mainSheetAnimation,
    );

    this.handleResize(screen.width, screen.height, screen.dpr);
    screen.subscribe(this.handleResize);

    const axesHelper = new AxesHelper(10000);
    this.mainScene.add(axesHelper);

    const ground = new TerrainPlane(1000, 1);
    this.mainScene.add(ground.planMesh);
    this.matcapIgnored.push(ground.planMesh.uuid);

    this.mainScene.background = new Color("#37323E");

    this.experience = new Experience(
      this.renderer,
      this.canvas,
      this.mainScene,
      this.cameraController,
    );

    const guiFolder = gui.addFolder("globals");

    guiFolder.close();
    guiFolder
      .add(this.guiOpt, "workbench shading")
      .onChange((value: boolean) => {
        this.makeAllMeshesTexture(value);
      });

    this.loadBasicMatcap();
  }

  loadBasicMatcap = async () => {
    const tl = new TextureLoader();
    const result = await new Promise<Texture>((resolve, reject) => {
      tl.load(
        "/matcaps/basic_blender_matcap.jpg",
        (texture) => {
          resolve(texture);
        },
        () => {},
        () => {
          reject();
        },
      );
    }).catch(() => {
      return new Error();
    });
    if (result instanceof Error) return;
    this.basicMatcapTexture = new MeshMatcapMaterial({
      matcap: result,
    });
  };

  makeAllMeshesTexture = (value: boolean) => {
    if (!this.basicMatcapTexture) {
      // TODO: print issue
      return;
    }
    if (value) {
      this.backupMaterials = [];
      this.mainScene.traverse((obj) => {
        if (obj instanceof Mesh && !this.matcapIgnored.includes(obj.uuid)) {
          this.backupMaterials.push({
            uid: obj.uuid,
            mat: obj.material,
          });
          obj.material = this.basicMatcapTexture;
        }
      });
    } else {
      this.mainScene.traverse((obj) => {
        if (obj instanceof Mesh) {
          const matchingUUid = this.backupMaterials.find(
            (el) => el.uid === obj.uuid,
          );
          if (matchingUUid) {
            obj.material = matchingUUid.mat;
          }
        }
      });
    }
  };

  handleResize = (width: number, height: number, dpr: number) => {
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.renderer.setPixelRatio(dpr * 2);
    this.renderer.setSize(width, height);
  };

  start() {
    ticker.subscribe(this.tick, Infinity);
  }

  private tick = (time: number, delta: number, frame: number) => {
    this.orbitControls?.update();
    this.experience?.tick?.(time, delta);
    this.renderer.render(this.mainScene, this.cameraController.currentCamera);
  };
}

function main() {
  const canvas = document.querySelector("#canvas");
  if (!canvas || !(canvas instanceof HTMLCanvasElement))
    return new Error("canvas dom element could not be found");

  const experience = new Entry(canvas);
  experience.start();
}

const result = main();
if (result instanceof Error) {
  console.error(result.message);
} else {
  console.log("programme exited with code 0");
}

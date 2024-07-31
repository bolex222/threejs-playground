import "./style.css";

import {
  AxesHelper,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import ticker from "./ticker";
import screen from "./screenManager";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import TerrainPlane from "./terrainPlane/terrainPlan";
import { ExperimentalBox } from "./experimentalBox/experimentalBox";
import gui from "./gui/gui";

class Experience {
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private mainScene: Scene;
  private canvas: HTMLCanvasElement;
  private orbitControls: OrbitControls | null = null;
  private guiOpt = {
    orbitControls: true,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.camera = new PerspectiveCamera(50, screen.height / screen.width);
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.mainScene = new Scene();

    this.handleResize(screen.width, screen.height, screen.dpr);
    screen.subscribe(this.handleResize);

    const axesHelper = new AxesHelper(1);
    this.mainScene.add(axesHelper);

    const ground = new TerrainPlane(1000, 2);
    this.mainScene.add(ground.scene);

    this.mainScene.background = new Color(0x000000);

    const expBox = new ExperimentalBox();
    this.mainScene.add(expBox.scene);

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement,
    );
    const guiFolder = gui.addFolder("MAIN");
    guiFolder.add(this.guiOpt, "orbitControls").onChange((value: boolean) => {
      if (this.orbitControls) {
        this.orbitControls.enabled = value;
      }
    });
  }

  handleResize = (width: number, height: number, dpr: number) => {
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.camera.aspect = width / height;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height);
    this.camera.updateProjectionMatrix();
  };

  start() {
    ticker.subscribe(this.tick, Infinity);
  }

  private tick = () => {
    this.orbitControls?.update();
    this.renderer.render(this.mainScene, this.camera);
  };
}

function main() {
  const canvas = document.querySelector("#canvas");
  if (!canvas || !(canvas instanceof HTMLCanvasElement))
    return new Error("canvas dom element could not be found");

  const experience = new Experience(canvas);
  experience.start();
}

const result = main();
if (result instanceof Error) {
  console.error(result.message);
} else {
  console.log("programme exited with code 0");
}

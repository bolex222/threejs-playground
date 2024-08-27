import "../style.css";
import "toastify-js/src/toastify.css";

import { AxesHelper, WebGLRenderer, AmbientLight } from "three";
import ticker from "../ticker";
import screen from "../view/screenManager";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import TerrainPlane from "../models/terrainPlane/terrainPlan";
import { Experience } from "../main";
import CameraController from "../controllers/camera-controller";
import animationManager from "../controllers/animation-controller";

import editorsWorld from "../models/EditorsWorld";
import Environement3DElement from "../models/Environement3DElements";
import * as editorsWorldController from "../controllers/editor-world-controller";
import { initiateViewListeners } from "../view/use-interaction";
import { initViewPortUI } from "../view/UI";

class Entry {
  private cameraController: CameraController;
  private renderer: WebGLRenderer;
  private canvas: HTMLCanvasElement;
  private orbitControls: OrbitControls | null = null;
  private experience: Experience;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    animationManager.createSheet("main");

    this.cameraController = new CameraController(
      this.renderer.domElement,
      editorsWorld.scene,
    );

    this.handleResize(screen.width, screen.height, screen.dpr);
    screen.subscribe(this.handleResize);

    const axesHelper = new AxesHelper(10000);
    editorsWorldController.addEnvironement3DElement(axesHelper);

    const ground = new TerrainPlane(1000, 1);
    const groundEnvironmentBuffer = new Environement3DElement(ground.planMesh);
    editorsWorldController.addEnvironement3DElement(groundEnvironmentBuffer);

    const ambiantLight = new AmbientLight(0xffffff, 1);
    ambiantLight.position.set(10, 5, 10);
    editorsWorldController.addEnvironement3DElement(ambiantLight);
    // this.matcapIgnored.push(ground.planMesh.uuid);

    this.experience = new Experience(
      this.renderer,
      this.canvas,
      editorsWorld.scene,
      this.cameraController,
    );

    initiateViewListeners(this.canvas);

    initViewPortUI();
  }

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
    this.experience?.tick?.(time, delta, frame);
    this.renderer.render(
      editorsWorld.scene,
      this.cameraController.currentCamera,
    );
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

import "./style.css";

import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import ticker from "./ticker";
import screen from "./screenManager";

class BoxScene {
  public scene: Scene;
  private box: Mesh;

  constructor() {
    this.scene = new Scene();
    this.box = this.createRedBox();
    this.scene.add(this.box);

    ticker.subscribe(this.tick);
  }

  private createRedBox() {
    const geometry = new BoxGeometry();
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    return new Mesh(geometry, material);
  }

  private tick = (_: number, delta: number) => {
    this.box.rotateY(delta * 0.003);
  };
}

class Experience {
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private mainScene: Scene;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.camera = new PerspectiveCamera(50, screen.height / screen.width);
    this.camera.position.z = 5;
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
    });
    this.mainScene = new Scene();

    const boxScene = new BoxScene();
    this.mainScene.add(boxScene.scene);
    this.handleResize(screen.width, screen.height, screen.dpr);
    screen.subscribe(this.handleResize);
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

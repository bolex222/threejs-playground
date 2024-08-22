import { Scene, WebGLRenderer } from "three";

export abstract class ExperienceSetter {
  canvas: HTMLCanvasElement;
  scene: Scene;
  renderer: WebGLRenderer;

  constructor(
    renderer: WebGLRenderer,
    canvas: HTMLCanvasElement,
    scene: Scene,
  ) {
    this.scene = scene;
    this.canvas = canvas;
    this.renderer = renderer;
  }

  abstract tick: (time: number, delta: number, frame: number) => void;
}

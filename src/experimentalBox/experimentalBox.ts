import ticker from "../ticker";
import {
  Scene,
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  PointLight,
  AmbientLight,
} from "three";
import gui from "../gui/gui";
import { degToRad } from "three/src/math/MathUtils.js";

export class ExperimentalBox {
  public scene: Scene;
  private box: Mesh;
  // private guiFolder: GUI;

  private mouse: { x: number; y: number } = {
    x: 0,
    y: 0,
  };

  private previousMouse: { x: number; y: number } = {
    x: 0,
    y: 0,
  };

  guiVal = {
    x: 0,
    y: 0,
    z: 0,
  };

  constructor() {
    const guiFolder = gui.addFolder("Cube rotation");
    guiFolder.add(this.guiVal, "x").min(0).max(90);
    guiFolder.add(this.guiVal, "y").min(0).max(90);
    guiFolder.add(this.guiVal, "z").min(0).max(90);

    this.scene = new Scene();
    this.box = this.createRedBox();
    this.scene.add(this.box);

    // const pointLight = new PointLight(0xffffff, 1000);
    // pointLight.position.set(5, 5, 5);
    // pointLight.castShadow = true;
    // this.scene.add(pointLight);

    // const pont = new Ponc

    const ambiantLight = new AmbientLight(0xffffff, 3);
    this.scene.add(ambiantLight);

    ticker.subscribe(this.tick);
    window.addEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseMove = (e: MouseEvent) => {
    this.mouse = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  private createRedBox() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshStandardMaterial({
      color: "#BFBDC1",
      metalness: 0,
      roughness: 0.5,
    });
    return new Mesh(geometry, material);
  }

  private tick = () => {
    console.log(this.mouse);
    this.box.rotation.set(
      degToRad(this.guiVal.x),
      degToRad(this.guiVal.y),
      degToRad(this.guiVal.z),
    );
  };
}

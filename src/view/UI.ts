import Toastify from "toastify-js";
import { GUI, OptionController, StringController } from "lil-gui";
import { RenderModeOptions } from "../models/Basic3DElement";
import editorsWorld from "../models/EditorsWorld";
import { setRenderMode } from "../controllers/editor-world-controller";
import { createAnimationSheet } from "../controllers/animation-controller";
import { VIEWPORT_CAMERA } from "../models/models/camera-model";
import { changeCamera, createCamera } from "../controllers/camera-controller";

export const showError = (message: string) => {
  Toastify({
    text: message,
    close: true,
    duration: 10_000,
    style: {
      background: "linear-gradient(to right, #ff5f6d, #ffc371)",
    },
  }).showToast();
};

export const showDragAndDropPanel = () => {
  const dragAndDropPanel = document.querySelector(
    "#drag_and_drop_zone",
  ) as HTMLElement;
  if (dragAndDropPanel?.style) {
    dragAndDropPanel.style.opacity = "1";
  }
};

export const hideDragAndDropPanel = () => {
  const dragAndDropPanel = document.querySelector(
    "#drag_and_drop_zone",
  ) as HTMLElement;
  if (dragAndDropPanel?.style) {
    dragAndDropPanel.style.opacity = "0";
  }
};

const gui = new GUI();

const viewPortUI = {
  "render mode": "workbench",
};

const animationUI = {
  name: "animation",
  "create animation": createAnimationSheet,
};

const cameraUI = {
  "current camera": VIEWPORT_CAMERA,
  "add camera": () => {},
};

export const initViewPortUI = () => {
  const folder = gui.addFolder("viewport");
  folder
    .add(viewPortUI, "render mode", ["default", "workbench", "wireframe"])
    .onChange((value: RenderModeOptions) => {
      setRenderMode(value);
    });
  folder.close();
};

export const initAnimationUI = () => {
  const folder = gui.addFolder("Animation");
  animationUI["create animation"] = () => {
    const stringController = folder.controllers?.[1] as
      | StringController
      | undefined;
    const currentName = stringController
      ? stringController.$input.value
      : "animaiton " + editorsWorld.animation.sheets.length;
    createAnimationSheet(currentName);
  };
  folder.add(animationUI, "create animation");
  folder.add(animationUI, "name");
  folder.close();
};

export const initCameraUI = () => {
    cameraUI["add camera"] = createCamera
    const folder = gui.addFolder("Cameras");
    folder.close();
    editorsWorld.camera.guiCameraSelector = folder
      .add(cameraUI, "current camera", editorsWorld.camera.cameraChoises)
      .onChange(changeCamera) as OptionController;
    folder.add(cameraUI, "add camera");
};

export default gui;

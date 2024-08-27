import Toastify from "toastify-js";
import { GUI } from "lil-gui";
import { RenderModeOptions } from "../models/Basic3DElement";
import editorsWorld from "../models/EditorsWorld";
import { setRenderMode } from "../controllers/editor-world-controller";

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

export const initViewPortUI = () => {
  const folder = gui.addFolder("viewport");
  folder
    .add(viewPortUI, "render mode", ["default", "workbench", "wireframe"])
    .onChange((value: RenderModeOptions) => {
      setRenderMode(value);
    });
};

export default gui;

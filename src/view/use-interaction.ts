import {
  handleDragOver,
  handleDrop,
} from "../controllers/drag-and-drop-controller";
import { hideDragAndDropPanel, showDragAndDropPanel } from "./UI";

export const initiateViewListeners = (domElement: HTMLElement) => {
  domElement.addEventListener("dragenter", showDragAndDropPanel);
  domElement.addEventListener("dragleave", hideDragAndDropPanel);
  domElement.addEventListener("dragover", handleDragOver);
  domElement.addEventListener("drop", handleDrop);
  domElement.addEventListener("mouseleave", hideDragAndDropPanel);
};

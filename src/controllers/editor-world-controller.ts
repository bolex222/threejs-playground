import { Object3D } from "three";
import Basic3dElement, { RenderModeOptions } from "../models/Basic3DElement";
import editorsWorld from "../models/EditorsWorld";
import Environement3DElement from "../models/Environement3DElements";

export const addEnvironement3DElement = (
  element: Environement3DElement | Object3D,
) => {
  const parsedElement =
    element instanceof Environement3DElement
      ? element
      : new Environement3DElement(element);
  parsedElement.globallyVisible = editorsWorld.editorsEnvironementVisible;
  editorsWorld.editorRelative3DElements.push(parsedElement);
  editorsWorld.scene.add(parsedElement.object);
};

export const addBasic3DElement = (element: Basic3dElement | Object3D) => {
  const parsedElement =
    element instanceof Basic3dElement ? element : new Basic3dElement(element);
  parsedElement.renderMode = editorsWorld.renderMode;
  editorsWorld.basic3dElements.push(parsedElement);
  editorsWorld.scene.add(parsedElement.object);
};

export const setRenderMode = (value: RenderModeOptions) => {
  editorsWorld.renderMode = value;
  for (const basicElement of editorsWorld.basic3dElements) {
    basicElement.renderMode = value;
  }
};

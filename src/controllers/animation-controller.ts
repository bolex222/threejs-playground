import type { ISheet } from "@theatre/core";
import editorsWorld from "../models/EditorsWorld";
import Basic3dElement from "../models/Basic3DElement";
import AnimationObjectElement from "../models/models/animation-object-element";
import AnimationObjectCamera from "../models/models/animation-object-camera";
import EditorCamera from "../models/models/editor-camera";

const addAllBasicElementToSheet = (sheet: ISheet) => {
  for (const basicElement of editorsWorld.basic3dElements) {
    const sheetObject = basicElement.convertToAnimationObject(sheet);
    const animationObject = new AnimationObjectElement(
      basicElement,
      sheetObject,
    );
    editorsWorld.animation.addAnimationObject(animationObject);
  }
};

export const addBasicElementToAllSheet = (basicElement: Basic3dElement) => {
  for (const sheet of editorsWorld.animation.sheets) {
    const sheetObject = basicElement.convertToAnimationObject(sheet);
    const animationObject = new AnimationObjectElement(
      basicElement,
      sheetObject,
    );
    editorsWorld.animation.addAnimationObject(animationObject);
  }
};

export const addCameraToAllSheet = (camera: EditorCamera) => {
  for (const sheet of editorsWorld.animation.sheets) {
    const sheetObject = camera.convertToAnimationObject(sheet);
    const animationObject = new AnimationObjectCamera(camera, sheetObject);
    editorsWorld.animation.addAnimationCamera(animationObject);
  }
};

const addAllCameraToSheet = (sheet: ISheet) => {
  for (const camera of editorsWorld.camera.cameras) {
    const sheetObject = camera.convertToAnimationObject(sheet);
    const animationObject = new AnimationObjectCamera(camera, sheetObject);
    editorsWorld.animation.addAnimationCamera(animationObject);
  }
};

const parseAnimationName = (name: string): string => {
  const doesAnimationExist = editorsWorld.animation.sheets.find(
    (sheet) => sheet.address.sheetId === name,
  );
  if (!doesAnimationExist) {
    return name;
  }
  const regex = new RegExp(`^${name}\\s\\d+$`);
  const amountOfSimilarName = editorsWorld.animation.sheets.reduce(
    (prev, curr) => {
      console.log(curr.address.sheetId);
      if (regex.test(curr.address.sheetId)) {
        return prev + 1;
      }
      return prev;
    },
    0,
  );

  return `${name} ${amountOfSimilarName + 1}`;
};

export const createAnimationSheet = (name: string) => {
  const parsedName = parseAnimationName(name);
  const newSheet = editorsWorld.animation.animationProject.sheet(parsedName);
  editorsWorld.animation.sheets.push(newSheet);
  addAllBasicElementToSheet(newSheet);
  addAllCameraToSheet(newSheet);
};

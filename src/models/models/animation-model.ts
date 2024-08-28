import { IProject, ISheet, getProject } from "@theatre/core";
import studio from "@theatre/studio";
import AnimationObjectElement from "./animation-object-element";
import AnimationObjectCamera from "./animation-object-camera";

class AnimationModel {
  animationProject: IProject;
  sheets: Array<ISheet> = [];
  animationObject: Array<AnimationObjectElement> = [];
  animationCameras: Array<AnimationObjectCamera> = [];

  constructor() {
    this.animationProject = getProject("Threejs palyground");
    studio.initialize();
  }

  addAnimationObject = (animationObject: AnimationObjectElement) => {
    this.animationObject.push(animationObject);
  };

  addAnimationCamera = (animationCamera: AnimationObjectCamera) => {
    this.animationCameras.push(animationCamera)

  }
}

export default AnimationModel;

import { getProject, IProject, ISheet } from "@theatre/core";
import studio from "@theatre/studio";

class AnimationManager {
  project: IProject;
  sheets: Array<ISheet> = [];
  constructor() {
    studio.initialize();
    this.project = getProject("Threejs palyground");
  }

  createSheet = (sheetName: string): ISheet => {
    const newSheet = this.project.sheet(sheetName);
    this.sheets.push(newSheet);
    return newSheet;
  };

  getSheetByName = (name: string) => {
    return this.sheets.find((e) => e.address.sheetId === name);
  };
}

const animationManager = new AnimationManager();
export default animationManager;

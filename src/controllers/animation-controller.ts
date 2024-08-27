import { getProject, IProject, ISheet } from "@theatre/core";
import studio from "@theatre/studio";

class AnimationController {
  project: IProject;
  sheets: Array<ISheet> = [];
  constructor() {
    studio.initialize();
    this.project = getProject("Threejs palyground");
  }

  createSheet = (sheetName: string): ISheet => {
    const newSheet = this.project.sheet(sheetName);
    this.sheets.push(newSheet);
    newSheet.object
    return newSheet;

  };

  getSheetByName = (name: string) => {
    return this.sheets.find((e) => e.address.sheetId === name);
  };
}

const animationManager = new AnimationController();
export default animationManager;

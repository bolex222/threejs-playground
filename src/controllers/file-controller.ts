import { addBasic3DElement } from "./editor-world-controller";
import { parseGlbFile } from "./Glb-file-controller";

const handleReadFile =
  (
    resolve: (value: ArrayBuffer | string) => void,
    reject: (reason: any) => void,
  ) =>
    (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (!result) {
        reject("Could not read the provided file.");
        return;
      }
      resolve(result);
      return;
    };

export const readFile = async (file: File): Promise<ArrayBuffer | string> => {
  const fileReader = new FileReader();
  return new Promise<ArrayBuffer | string>((resolve, reject) => {
    fileReader.addEventListener("load", handleReadFile(resolve, reject));
    fileReader.readAsArrayBuffer(file);
  });
};

const processGlbFile = async (file: File) => {
  const fileContent = await readFile(file);
  const glbResult = await parseGlbFile(fileContent, file.name);
  addBasic3DElement(glbResult);
};

export const processAnyFile = async (file: File): Promise<void> => {
  const filename = file.name;
  const extension = filename.split(".").pop()?.toLowerCase();

  if (!extension) {
    throw new Error("file type could not be identified.");
  }

  switch (extension) {
    case "glb":
      await processGlbFile(file);
      break;
    default:
      throw new Error("Unsupported file format (" + extension + ").");
  }
};

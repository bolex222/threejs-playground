import { hideDragAndDropPanel, showError } from "../view/UI";
import { processAnyFile } from "./file-controller";

const getFileFromDragEvent = (event: DragEvent): Array<File> => {
  const filesFromItems = [...(event.dataTransfer?.items || [])]
    .map((item) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        return file || null;
      }
    })
    .filter((file) => file instanceof File);

  if (filesFromItems.length > 0) {
    return filesFromItems;
  }

  const filesFromEvent = [...(event.dataTransfer?.files || [])].filter(
    (file) => file instanceof File,
  );

  return filesFromEvent;
};

export const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

export const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  hideDragAndDropPanel();

  const files = getFileFromDragEvent(event);
  const allProcessedFiles = await Promise.allSettled(
    files.map((file) => processAnyFile(file)),
  );
  for (const processedFile of allProcessedFiles) {
    if (processedFile.status === "rejected") {
      showError(processedFile.reason);
    }
  }
};

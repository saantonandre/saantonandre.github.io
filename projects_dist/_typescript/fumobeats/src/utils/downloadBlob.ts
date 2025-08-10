import JSZip from "jszip";

/** [ FileName, Blob ] */
type NamedBlob = [string, Blob];
export function downloadBlob([name, content]: NamedBlob, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  downloadBlobData([name, blob]);
}
export function downloadBlobData([name, blob]: NamedBlob) {
  const url = URL.createObjectURL(blob);
  const tmp = document.createElement("a");
  tmp.href = url;
  tmp.setAttribute("download", name);
  tmp.click();
}
export async function zipFiles(
  /** Array of [Blob, fileName] */
  filesArray: NamedBlob[],
  fileName: string
): Promise<NamedBlob> {
  const zip = new JSZip();
  filesArray.forEach(([name, blob]) => zip.file(name, blob));
  const zippedBlob = await zip.generateAsync({ type: "blob" });
  return [fileName, zippedBlob];
}
export const downloadFilesZip = async (
  /** Array of [Blob, fileName] */
  filesArray: NamedBlob[],
  fileName: string
) => {
  downloadBlob(await zipFiles(filesArray, fileName), "application/zip");
};

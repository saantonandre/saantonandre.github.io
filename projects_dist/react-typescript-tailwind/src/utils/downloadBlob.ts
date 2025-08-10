export const downloadBlob = (
  content: string,
  filename: string,
  contentType: string
) => {
  // Create a blob
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);

  // Create a link to download it
  const tmp = document.createElement("a");
  tmp.href = url;
  tmp.setAttribute("download", filename);
  tmp.click();
  tmp.parentElement?.removeChild(tmp);
};

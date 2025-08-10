export async function importFilesRequest() {
  const promise = new Promise<FileList>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = () => {
      const files = input.files;
      if (!files) return reject();
      input.remove();
      resolve(files);
    };
    input.click();
    input.remove();
  });
  return await promise;
}

export const downloadUrl = async (url: string, noSave?: boolean):Promise<[Blob,string]> => {
  const resp = await fetch(url);
  const fileBlob = await resp.blob();
  const pathnameArr = new URL(url).pathname.split("/");
  const resourceName = decodeURIComponent(pathnameArr[pathnameArr.length - 1]);
  if (!noSave) {
    saveBlob(fileBlob,resourceName)
  }
  return [fileBlob,resourceName];
};

export const saveBlob=(blob:Blob,fileName:string)=>{
  let tempUrl = URL.createObjectURL(blob);
  const aTag = document.createElement("a");
  aTag.href = tempUrl;
  aTag.download = fileName;
  document.body.appendChild(aTag);
  aTag.click();
  URL.revokeObjectURL(tempUrl);
  aTag.remove();
}
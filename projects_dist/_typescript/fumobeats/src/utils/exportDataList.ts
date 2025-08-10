import { downloadBlob } from "utils/downloadBlob";

export const exportDataList = (data: object[], fileName: string) => {
  if (data.length < 1) return false;
  const headers = Object.keys(data[0]) as (keyof object)[];
  exportItemList(data, fileName, headers);
};
export const exportItemList = (
  data: object[],
  fileName: string = "",
  customHeaders?: string[]
) => {
  const headers = customHeaders || Object.keys(data[0]);
  const arrayData = data.map((item: any) =>
    headers.map((header: any) => item[header] || "")
  );
  const content = [headers].concat(arrayData);
  const csv = content
    .map((row) =>
      row
        .map(String)
        .map((v) => v.replaceAll('"', '""'))
        .map((v) => `"${v}"`)
        .join(",")
    )
    .join("\r\n");
  const currentDate = new Date().toISOString().slice(0, 10);
  downloadBlob(
    [fileName + currentDate + ".csv", new Blob([csv])],
    "text/csv; header=present"
  );
};

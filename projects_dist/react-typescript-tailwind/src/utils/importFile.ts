export async function importFile(fileURL: string):Promise<string> {
  console.log(`Creating dataset from ${fileURL}...`);
  return new Promise((resolve) => {
    // Create request
    let file = new XMLHttpRequest();
    // What happens once the request completes
    file.addEventListener("load", () => {
      console.log(`File ${fileURL} ready`);
      return resolve(file.response);
    });
    // Requests for the file
    file.responseType = "text";

    // Sets the request method and request URL
    file.open("GET", fileURL);

    // Initiates the request
    file.send();
  });
}
export default importFile;

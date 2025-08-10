export const importFile = async (fileURL: string) => {
  return new Promise<string>((resolve) => {
    // Create request
    let file = new XMLHttpRequest();
    // What happens once the request completes
    file.addEventListener("load", () => {
      return resolve(file.response);
    });
    // Requests for the file
    file.responseType = "text";

    // Sets the request method and request URL
    file.open("GET", fileURL);

    // Initiates the request
    file.send();
  });
};

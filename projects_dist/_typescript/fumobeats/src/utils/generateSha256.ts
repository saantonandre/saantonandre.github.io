export const generateSha256 = async (file: File) => {
  const arrBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const hashBase64 = hexToBase64(hashHex);
  return hashBase64;
};

export function hexToBase64(string: String) {
  const stringArr = string.match(/.{2}/g);
  if (!stringArr) throw new Error("Error!");
  return window.btoa(
    String.fromCharCode(...stringArr.map((c) => parseInt(c, 16)))
  );
}

export const digestString = async (message: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return hash;
};
export const generateFilesHash = async (files: File[]) => {
  // For each file generate a SHA-256 digest and convert it to Base64 
  const hashes = await Promise.all(files.map((file) => generateSha256(file)));
  // Sort the hashes alphabetically and join them as a single string
  const joined = hashes.sort().join();
  // Generate SHA-256 of sorted and joined hashes
  const digest = await digestString(joined);
  // Return its hex form 
  const digestHex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return digestHex;
};

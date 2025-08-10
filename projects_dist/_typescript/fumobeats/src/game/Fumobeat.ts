export type Fumobeat = {
  metadata: {
    name: string;
    author: string;
    created_at: number;
    duration: number;
    version: number;
  };
  file: File;
  beats: number[];
};

export const DUMMY_FUMO_NAME =
  "Import a .nuero or an .mp3 file to start editing";
export function getDummyFumobeat() {
  const username = localStorage.getItem("username");
  const dummy: Fumobeat = {
    metadata: {
      name: DUMMY_FUMO_NAME,
      author: username || "Anonymous mapper",
      created_at: Date.now(),
      duration: 120,
      version: 1,
    },
    file: new File([], "fumobeat"),
    beats: [],
  };
  return dummy;
}

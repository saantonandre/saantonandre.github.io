import { View } from "modules/View";
import JSZip from "jszip";
import {
  downloadBlobData,
  downloadFilesZip,
  zipFiles,
} from "utils/downloadBlob";
import { handleDragAndDrop } from "game/ModesManager/handleDragAndDrop";
import { eventStream } from "game/gameEvents";
import { Fumobeat, getDummyFumobeat } from "game/Fumobeat";
export class FilesHandler {
  hoveredFiles: FileList | null = null;
  constructor(canvas: HTMLCanvasElement) {
    handleDragAndDrop(canvas);
  }
  compute(currentMode: string) {
    eventStream.read("files-import-request", async ({ files }) => {
      eventStream.post("loading", true);
      const file = files[0];
      if (!file) return eventStream.post("loading", false);
      const ext = file.name.split(".").pop();
      switch (ext) {
        case "nuero":
          eventStream.post("loading", true);
          const fumobeats = await FilesHandler.importFumobeats(files);
          eventStream.post("loading", false);
          if (currentMode === "editor") {
            eventStream.post("fumobeat-edit", { fumobeat: fumobeats[0] });
          } else {
            eventStream.post("switch-mode", { mode: "playlist" });
            eventStream.post("fumobeats-import", { fumobeats });
          }

          break;
        case "mp3":
          eventStream.post("switch-mode", { mode: "editor" });
          eventStream.post("fumobeat-edit", {
            fumobeat: await this.createFumobeat(file),
          });
          break;
        case "zip":
          eventStream.post("loading", true);
          const zip = await JSZip.loadAsync(file);
          const fumobeatsFiles: File[] = [];
          for (const file in zip.files) {
            fumobeatsFiles.push(
              new File(
                [await zip.files[file].async("arraybuffer")],
                zip.files[file]["name"]
              )
            );
          }
          eventStream.post("switch-mode", { mode: "playlist" });
          const fumobeats2 = await FilesHandler.importFumobeats(fumobeatsFiles);
          eventStream.post("fumobeats-import", { fumobeats: fumobeats2 });
          break;
      }
      eventStream.post("loading", false);
    });
    eventStream.read("fumobeats-export", async ({ fumobeats }) => {
      eventStream.post("loading", true);
      await this.exportFumobeats(fumobeats);
      eventStream.post("loading", false);
    });
  }
  // render(view: View) {}
  /** Imports a fumobeat */
  static async importFumobeats(fumobeatFiles: FileList | File[]) {
    const fumobeats = [];
    for (const fumobeatFile of fumobeatFiles) {
      console.log(fumobeatFile);
      const data = await JSZip.loadAsync(fumobeatFile);
      const metadata: Fumobeat["metadata"] = JSON.parse(
        await data.files["metadata"].async("text")
      );
      const beats: Fumobeat["beats"] = [
        ...new Uint32Array(await data.files["beats"].async("arraybuffer")).sort(),
      ];
      const file: Fumobeat["file"] = new File(
        [await data.files["file"].async("arraybuffer")],
        metadata["name"]
      );
      const fumobeat: Fumobeat = {
        metadata,
        beats,
        file,
      };
      fumobeats.push(fumobeat);
    }
    return fumobeats;
  }
  /** Imports an mp3 as a fumobeat */
  private async createFumobeat(fumobeatFile: File) {
    const fumobeat: Fumobeat = {
      ...getDummyFumobeat(),
      file: fumobeatFile,
    };
    fumobeat.metadata.name = fumobeatFile.name.split(".")[0];
    return fumobeat;
  }
  /** Exports a fumobeat as single .nuero, or multiple fumobeats as a .zip */
  private async exportFumobeats(fumobeats: Fumobeat[]) {
    console.log("Exporting: ", fumobeats);
    const promises = fumobeats.map(async (fumobeat) => {
      const metadataBlob: [string, Blob] = [
        "metadata",
        new Blob([JSON.stringify(fumobeat.metadata)], {
          type: "application/json",
        }),
      ];
      const beatsBlob: [string, Blob] = [
        "beats",
        new Blob([new Uint32Array(fumobeat.beats.sort())], {
          type: "application/octet-stream",
        }),
      ];
      const mp3Blob: [string, Blob] = [
        "file",
        new Blob([fumobeat.file], { type: "audio/mpeg" }),
      ];
      return await zipFiles(
        [metadataBlob, beatsBlob, mp3Blob],
        fumobeat.metadata.name + ".nuero"
      );
    });
    const nueros = await Promise.all(promises);
    if (nueros.length === 1) {
      return downloadBlobData(nueros[0]);
    }
    return downloadFilesZip(nueros, "fumobeats.zip");
  }
}

import { fumobeatsIndex } from "assets/fumobeats";
import { FilesHandler } from "game/FilesHandler";
import { Fumobeat, getDummyFumobeat } from "game/Fumobeat";
import { eventStream } from "game/gameEvents";
import { getObjectKeys } from "utils/getObjectKeys";
console.log({ fumobeatsIndex });
export class FumobeatsStorage {
  db: IDBDatabase | null = null;
  storeName: string;
  dbName: string;
  fumobeats: Fumobeat[] = [];
  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.init().then(async () => {
      this.fumobeats.push(...(await this.listFumobeats()));
    });
    // this.resetAll();
  }
  private resetAll() {
    indexedDB.deleteDatabase(this.dbName);
    console.log("Completely deleted indexed DBs");
  }
  private async importDefaults() {
    for (const fumobeatFile in fumobeatsIndex) {
      const binary = await fetch(
        fumobeatsIndex[fumobeatFile as keyof typeof fumobeatsIndex]
      );
      const buffer = await binary.arrayBuffer();
      const file = new File([buffer], "rockefeller.nuero");
      const [fumobeat] = await FilesHandler.importFumobeats([file]);
      this.addFumobeat(fumobeat);
    }
  }
  private async init() {
    console.log("Initializing DB");
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const openIDBRequest = window.indexedDB.open(this.dbName, 3);
      openIDBRequest.onerror = (e) => reject(e);
      openIDBRequest.onsuccess = () => resolve(openIDBRequest.result);
      openIDBRequest.onupgradeneeded = (e) => {
        console.log("Defining DB schema");
        const db = openIDBRequest.result;
        const store = db.createObjectStore(this.storeName, {
          keyPath: "name",
        });
        const keys = getObjectKeys(getDummyFumobeat());
        store.createIndex("id", "name", { unique: true });
        for (const key of keys) {
          store.createIndex(key, key);
        }
        this.importDefaults();
      };
    });
    this.db = db;
  }
  private async addFumobeat(fumobeat: Fumobeat) {
    console.log(`Adding fumobeat`, fumobeat);
    const promise = new Promise<void>((resolve, reject) => {
      if (!this.db) return reject("DB not initialized");
      const transaction = this.db.transaction([this.storeName], "readwrite");
      transaction.oncomplete = () => {};
      transaction.onerror = (e) => {
        console.error(`Error creating a db transaction`, e);
        reject(e);
      };
      const store = transaction.objectStore(this.storeName);
      // Property `name` serves as an unique id to avoid duplicates
      const name = fumobeat.metadata.name;
      const request = store.put({ ...fumobeat, name });
      request.onerror = (e) => {
        console.error(`Error adding fumobeat: ${fumobeat.metadata.name}`, e);
        reject(e);
      };
      request.onsuccess = () => {
        console.log(`Fumobeat added: ${fumobeat.metadata.name}`);
        resolve();
      };
    });
    await promise;
    this.fumobeats.push(fumobeat);
  }
  private async deleteFumobeat(fumobeatName: string) {
    console.log(`Deleting fumobeat`, fumobeatName);
    const promise = new Promise<void>((resolve, reject) => {
      if (!this.db) return reject("DB not initialized");
      const transaction = this.db.transaction([this.storeName], "readwrite");
      transaction.oncomplete = () => {};
      transaction.onerror = (e) => {
        console.error(`Error creating a db transaction`, e);
        reject(e);
      };
      const store = transaction.objectStore(this.storeName);
      // Property `name` serves as an unique id to avoid duplicates
      const request = store.delete(fumobeatName);
      request.onerror = (e) => {
        console.error(`Error deleting fumobeat: ${fumobeatName}`, e);
        reject(e);
      };
      request.onsuccess = () => {
        console.log(`Fumobeat deleted: ${fumobeatName}`);
        resolve();
      };
    });
    await promise;
    const index = this.fumobeats.findIndex(
      (f) => f.metadata.name === fumobeatName
    );
    console.log({ index });
    if (index >= 0) {
      this.fumobeats.splice(index, 1);
    }
  }
  private async listFumobeats() {
    return new Promise<Fumobeat[]>((resolve, reject) => {
      if (!this.db) return reject("DB not initialized");
      const store = this.db
        .transaction(this.dbName)
        .objectStore(this.storeName);
      const cursorReq = store.openCursor();
      const fumobeats: Fumobeat[] = [];
      cursorReq.onsuccess = (
        event: Event & { target: { result?: IDBCursorWithValue } | null }
      ) => {
        const cursor = event.target?.result;
        if (!cursor) {
          return resolve(fumobeats);
        }
        fumobeats.push(cursor.value);
        cursor.continue();
      };
      cursorReq.onerror = (e) => reject(e);
    });
  }

  compute() {
    eventStream.read("fumobeats-import", async ({ fumobeats }) => {
      console.log("fumobeats-import");
      for (const fumobeat of fumobeats) {
        this.addFumobeat(fumobeat);
      }
    });
    eventStream.read("fumobeats-delete", async ({ fumobeats }) => {
      console.log("fumobeats-delete");
      for (const fumobeat of fumobeats) {
        this.deleteFumobeat(fumobeat.metadata.name);
      }
    });
  }
}

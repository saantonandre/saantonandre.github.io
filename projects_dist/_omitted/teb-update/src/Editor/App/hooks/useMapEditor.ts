import { MapEditor } from "../../MapEditor";

export const useMapEditor = () => {
  const mapEditor = window.mapEditor as MapEditor;
  return { editor: mapEditor };
};

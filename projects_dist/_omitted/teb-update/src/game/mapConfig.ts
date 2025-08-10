import { MapEditorConfig } from "@Editor/MapEditor/MapEditor";
import { imagesIndex } from "../assets/images";


const tiles = [
  /** single 1 */
  [8, 4],
  /** single 2 */
  [13, 6],
  /** parquet */
  [9, 4],
  [10, 4],
  [11, 4],
  [9, 5],
  [10, 5],
  [11, 5],
  [9, 6],
  [10, 6],
  [11, 6],
  /** column */
  [12, 4],
  [12, 5],
  [12, 6],
  /** column lying*/
  [13, 5],
  [14, 5],
  [15, 5],
  /** spikes */
  [14, 6],
] as const;

export const mapConfig: Partial<MapEditorConfig> = {
  tiles,
  sheet: imagesIndex._sheet_png,
  tilesize: 8,
};

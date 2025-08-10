import { firstCoffee } from "game/ModesManager/ModesManager";
import { FumoList } from "game/Modes/PlaylistMode/FumoList";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { ComputeProps } from "modules/Entity/Entity";
import { GameText } from "modules/Entity/GameText";
import { View } from "modules/View";
import { formatSeconds } from "utils/dateFormatter";
import { eventStream } from "game/gameEvents";

const dateMemo: Record<number, string> = {};
function formatDate(d: number) {
  const date = dateMemo[d];
  if (date) return date;
  dateMemo[d] = new Date(d).toISOString().slice(0, 10);
  return dateMemo[d];
}
export class FumoPreview extends InterfaceEntity {
  fumoList: FumoList;
  title = new GameText(0, 0);
  beats = new GameText(0, 0);
  duration = new GameText(0, 0);
  author = new GameText(0, 0);
  createdAt = new GameText(0, 0);
  version = new GameText(0, 0);
  downloadHovered = false;
  deleteHovered = false;
  constructor(fumoList: FumoList) {
    super();
    this.fumoList = fumoList;
    this.title.fontSize = 12;
    this.title.font = firstCoffee.family;
    this.title.shadowColor = "#ff818f";
    this.title.shadow = true;
    [
      this.title,
      this.beats,
      this.duration,
      this.author,
      this.createdAt,
      this.version,
    ].forEach((gameText, i) => {
      gameText.x = 1;
      gameText.y = 1.5 + i * 0.8;
      gameText.absolute = true;
      gameText.align = "left";
      gameText.color = "white";
    });
  }

  compute(props: ComputeProps) {
    const fumobeat = this.fumoList.hoveredFumo;
    eventStream.read(
      `fumobeat-download-button-out`,
      () => (this.downloadHovered = false)
    );
    eventStream.read(
      `fumobeat-delete-button-out`,
      () => (this.deleteHovered = false)
    );
    eventStream.read(
      `fumobeat-download-button-in`,
      () => (this.downloadHovered = true)
    );
    eventStream.read(
      `fumobeat-delete-button-in`,
      () => (this.deleteHovered = true)
    );
    if (!fumobeat) {
      this.title.content = "Hover a song to preview!";
      if (this.downloadHovered) this.title.content = "Export fumobeat";
      if (this.deleteHovered)
        this.title.content = "Delete fumobeat (FOREVER!!!)";
      return;
    }
    this.title.content = fumobeat.metadata.name;
    this.author.content = "Editor: " + fumobeat?.metadata.author;
    this.createdAt.content =
      "Creation date: " + formatDate(fumobeat.metadata.created_at);
    this.beats.content = "Beats: x" + fumobeat.beats.length;
    this.duration.content =
      "Duration: " + formatSeconds(fumobeat.metadata.duration);
    this.version.content = "Version: " + fumobeat.metadata.version;
  }
  render(view: View) {
    const fumobeat = this.fumoList.hoveredFumo;
    this.title.render(view);
    if (!fumobeat) return;
    this.defaultRender(view);
    this.author.render(view);
    this.createdAt.render(view);
    this.duration.render(view);
    this.beats.render(view);
    this.version.render(view);
  }
}

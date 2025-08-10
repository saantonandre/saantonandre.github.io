import { GameMode, GameModeProps } from "game/Modes/GameMode";
import { Fumobeat } from "game/Fumobeat";
import { eventStream } from "game/gameEvents";
import { BasicBackground } from "game/entities/interface/BasicBackground";
import { FumoList } from "game/Modes/PlaylistMode/FumoList";
import { UIButton } from "game/entities/interface/UIButton";
import { importFilesRequest } from "utils/importFilesRequest";
import { hoverEmotes } from "game/Modes/MainMenu/MainMenu";

export const PLAYLIST_AUDIO = "playlist-audio";
export class PlaylistMode extends GameMode {
  fumobeats: Fumobeat[];
  type = "playlist";
  loading = false;
  constructor(props: GameModeProps & { fumobeatsDB: Fumobeat[] }) {
    super(props);
    this.fumobeats = props.fumobeatsDB;
    this.ents.push(new BasicBackground(3, props.view.w, props.view.h));
    this.ents.push(
      new FumoList(this.fumobeats, props.sound, props.view.w - 9.5, 1)
    );

    const importButton = new UIButton({
      x: 1,
      y: props.view.h - 1,
      content: "Import fumobeats",
      align: "left",
      onClick: async () => {
        const files = await importFilesRequest();
        eventStream.post("files-import-request", { files });
      },
    });
    this.ents.push(importButton);

    const noFumobeats = new UIButton({
      content: "You have no fumobeats",
      fontSize: 18,
      x: props.view.w / 2,
      y: props.view.h / 2,
      align: "center",
    });
    noFumobeats.hovered = true;
    noFumobeats.render = (view) => {
      if (this.fumobeats.length) return;
      noFumobeats.renderButton(view);
    };
    noFumobeats.components.push(hoverEmotes(noFumobeats, "noooo"));
    this.ents.push(noFumobeats);

    const exportAllButton = new UIButton({
      x: 1,
      y: props.view.h - 2,
      content: "Export collection",
      align: "left",
      onClick: async () => {
        eventStream.post("fumobeats-export", { fumobeats: this.fumobeats });
      },
    });
    this.ents.push(exportAllButton);
  }

  onSwitchOut() {
    console.log("quit");
    this.sound.destroyCustomAudio(PLAYLIST_AUDIO);
  }
  compute(resume?: boolean) {
    this.initCompute(resume);
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].compute(this);
    }
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].render(this.view);
    }
  }
}

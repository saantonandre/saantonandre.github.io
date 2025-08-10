import { gameDebug } from "modules/Debug";
import { GameMode, GameModeProps } from "game/Modes/GameMode";
import { UIButton } from "game/entities/interface/UIButton";
import { eventStream } from "game/gameEvents";
import { GameEmote } from "game/entities/game/GameEmote";
import { ComputeProps } from "modules/Entity/Entity";
import { BasicBackground } from "game/entities/interface/BasicBackground";
import { importFilesRequest } from "utils/importFilesRequest";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { GitlogButton } from "game/Modes/MainMenu/GitlogButton";

export class MainMenu extends GameMode {
  constructor(props: GameModeProps) {
    super(props);
    this.ents.push(new BasicBackground(1, props.view.w, props.view.h));
    const center = this.view.center;
    const playlist = new UIButton({
      content: "Playlist",
      fontSize: 18,
      onClick: () => eventStream.post("switch-mode", { mode: "playlist" }),
      x: 8,
      y: center.y - 1.5,
      align: "center",
    });
    playlist.components.push(hoverEmotes(playlist, "edm"));
    const infinite = new UIButton({
      content: "Survival",
      fontSize: 18,
      onClick: () => eventStream.post("switch-mode", { mode: "arcade" }),
      x: 8,
      y: center.y,
      align: "center",
      disabled:true 
    });
    infinite.components.push(hoverEmotes(infinite, "noooo"));
    const editor = new UIButton({
      content: "Editor",
      fontSize: 18,
      onClick: () => eventStream.post("switch-mode", { mode: "editor" }),
      x: 8,
      y: center.y + 1.5,
      align: "center",
    });
    const editorIcon = hoverEmotes(editor, "fumo");
    editorIcon.behaviors.push((e) => {
      e.rot -= 0.02;
      return true;
    });
    editor.components.push(editorIcon);

    const options = new UIButton({
      content: "Options",
      fontSize: 18,
      onClick: () => alert("Not implemented yet!"),
      x: 8,
      y: center.y + 3,
      align: "center",
    });
    options.components.push(hoverEmotes(options, "cog"));
    
    const importButton = new UIButton({
      x: center.x,
      y: center.y + 5,
      content: "Click here or drop an mp3 to create a Fumobeat",
      onClick: async () => {
        const files = await importFilesRequest();
        eventStream.post("files-import-request", { files });
      },
    });
    const credits = new UIButton({
      x: 0.5,
      y: this.view.h - 0.5,
      content: "@saantonandre",
      onClick: () => window.open("https://saantonandre.github.io"),
      align: "left",
    });
    credits.behaviors.push((e) => {
      e.text.content = e.hovered ? e.content + " <---" : e.content;
      return true;
    });
    this.ents.push(
      playlist,
      infinite,
      importButton,
      credits,
      editor,
      options,
      new GitlogButton(this.view)
    );
    const title = new InterfaceEntity(center.x - 7.5, 0);
    title.h = 4;
    title.w = 15;
    title.setAnimation("idle", { xFrames: [0], yFrames: [32] });
    this.ents.push(title);
  }
  compute(resume?: boolean) {
    this.initCompute(resume);
    gameDebug.drawPoint(this.mouse.absolute, "red", true);
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].compute(this);
    }
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].render(this.view);
    }
  }
}
export function hoverEmotes(
  src: InterfaceEntity,
  emote: (typeof GameEmote.emotes)[number]
) {
  const e = new GameEmote();
  e.absolute = true;
  e.absolute = true;
  e.compute = (props: ComputeProps) => {
    if (!src.hovered) return;
    e.defaultCompute(props);
    e.x = src.hitbox.x - e.w - 0.2;
    e.y = src.hitbox.y;
  };
  e.render = (view) => {
    if (!src.hovered) return;
    e.renderSprite(view);
    e.x = src.hitbox.x + src.hitbox.w + 0.2;
    e.renderSprite(view);
  };
  e.loadAnimation(emote);
  return e;
}

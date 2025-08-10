import { GameMode, GameModeProps } from "game/Modes/GameMode";
import { DUMMY_FUMO_NAME, Fumobeat, getDummyFumobeat } from "game/Fumobeat";
import { eventStream } from "game/gameEvents";
import { UIButton } from "game/entities/interface/UIButton";
import { BasicBackground } from "game/entities/interface/BasicBackground";
import { importFilesRequest } from "utils/importFilesRequest";
import { ComputeProps } from "modules/Entity/Entity";
import { KeyButton } from "game/Modes/EditorMode/Controls/KeyButton";
import { LengthController } from "game/Modes/EditorMode/Controls/LengthController";
import { PlayController } from "game/Modes/EditorMode/Controls/PlayController";
import { PlaybackController } from "game/Modes/EditorMode/Controls/PlaybackController";
import { VolumeController } from "game/Modes/EditorMode/Controls/VolumeController";
import { WaveController } from "game/Modes/EditorMode/Controls/WaveController";
import { getSoundWaveData } from "game/Modes/EditorMode/getSoundWaveData";

export class EditorMode extends GameMode {
  fumobeat: Fumobeat = getDummyFumobeat();
  audioWave: Float32Array = new Float32Array();
  music: HTMLAudioElement = new Audio();
  type = "editor";
  loading = false;
  get hasValidFumobeat() {
    return this.fumobeat.metadata.name !== DUMMY_FUMO_NAME;
  }
  constructor(props: GameModeProps) {
    super(props);
    this.ents.push(new BasicBackground(2, props.view.w, props.view.h));
    const wave = new WaveController({
      editor: this,
      x: 0,
      y: 2.5,
      w: this.view.w,
      h: 4,
    });
    this.ents.push(wave);
    const playButton = new PlayController({ editor: this, x: 5, y: 7.5 });
    this.ents.push(playButton);
    const lengthController = new LengthController({
      editor: this,
      x: this.view.w / 2 - 5,
      y: 7.5,
    });
    this.ents.push(lengthController);
    const volumeController = new VolumeController({
      editor: this,
      x: this.view.w / 2 - 7,
      y: 9,
    });
    this.ents.push(volumeController);
    const playbackController = new PlaybackController({
      editor: this,
      x: this.view.w / 2 + 2,
      y: 9,
    });
    this.ents.push(playbackController);
    const exportButton = new UIButton({
      content: "Export",
      align: "right",
      fontSize: 12,
      x: this.view.w - 1,
      y: this.view.h - 0.5,
      onClick: () => {
        if (this.hasValidFumobeat) {
          eventStream.post("fumobeats-export", {
            fumobeats: [this.fumobeat],
          });
        }
      },
    });
    exportButton.compute = (props: ComputeProps) => {
      exportButton.text.opacity = this.hasValidFumobeat ? 1 : 0.7;
      exportButton.computeButton(props);
    };
    this.ents.push(exportButton);
    const saveButton = new UIButton({
      content: "Save to Playlist",
      align: "left",
      fontSize: 12,
      x: 1,
      y: this.view.h - 0.5,
      onClick: () => {
        if (this.hasValidFumobeat) {
          eventStream.post("fumobeats-import", {
            fumobeats: [this.fumobeat],
          });
          eventStream.post("switch-mode", {
            mode: "playlist",
          });
        }
      },
    });
    saveButton.compute = (props: ComputeProps) => {
      saveButton.text.opacity = this.hasValidFumobeat ? 1 : 0.7;
      saveButton.computeButton(props);
    };
    this.ents.push(saveButton);
    const zKey = new KeyButton({
      x: 4,
      y: this.view.h - 4,
      content: "z",
    });
    this.ents.push(zKey);
    const xKey = new KeyButton({
      x: 6,
      y: this.view.h - 4,
      content: "x",
    });
    this.ents.push(xKey);
    const title = new UIButton({
      x: 0.5,
      y: 1.2,
      align: "left",
      fontSize: 14,
      onClick: async () => {
        if (!this.hasValidFumobeat) {
          const files = await importFilesRequest();
          eventStream.post("files-import-request", { files });
          return;
        }
        const inputName = prompt(
          "Change the name of the song",
          this.fumobeat.metadata.name
        );
        this.fumobeat.metadata.name = inputName || this.fumobeat.metadata.name;
      },
    });
    title.behaviors.push((e) => {
      if (e.text?.content) e.text.content = this.fumobeat.metadata.name;

      return true;
    });
    this.ents.push(title);
    const nameLabel = new UIButton({
      x: this.view.w / 2 + 4.5,
      y: this.view.h - 3.5,
      align: "center",
      fontSize: 10,
      opacity: 0.8,
      content: "Your name:",
    });
    this.ents.push(nameLabel);
    const name = new UIButton({
      x: this.view.w / 2 + 4.5,
      y: this.view.h - 2.5,
      align: "center",
      fontSize: 14,
      content: this.fumobeat.metadata.author,
      onClick: (e) => {
        const author = this.fumobeat.metadata.author;
        const newAuthorName = prompt("Insert your name here", author) || author;
        localStorage.setItem("username", newAuthorName);
        this.fumobeat.metadata.author = newAuthorName;
        if (e.text?.content) {
          e.text.content = this.fumobeat.metadata.author;
        }
      },
    });
    this.ents.push(name);
  }
  async importFumobeat(fumobeat: Fumobeat) {
    eventStream.post("loading", true);
    this.music.src = URL.createObjectURL(fumobeat.file);
    this.audioWave = await getSoundWaveData(
      this.sound.audioContext,
      fumobeat.file
    );
    this.fumobeat = fumobeat;
    this.fumobeat.metadata.duration = this.music.duration;
    eventStream.post("loading", false);
  }
  compute(resume?: boolean) {
    eventStream.read("fumobeat-edit", async ({ fumobeat }) => {
      this.importFumobeat(fumobeat);
    });
    this.initCompute(resume);
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].compute(this);
    }
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].render(this.view);
    }
  }
  onSwitchOut() {
    this.music.pause();
  }
}

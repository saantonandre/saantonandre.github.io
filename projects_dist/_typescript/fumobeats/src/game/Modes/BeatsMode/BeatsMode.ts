import { GameMode, GameModeProps } from "game/Modes/GameMode";
import { Player } from "game/entities/game/Player/Player";
import { Fumobeat, getDummyFumobeat } from "game/Fumobeat";
import { eventStream } from "game/gameEvents";
import { Point } from "modules/types/shapes";
import { EntManager } from "game/entities/game/EntManager";
import { BasicBackground } from "game/entities/interface/BasicBackground";
import { GameChat } from "game/entities/game/GameChat/GameChat";
import {
  applyFumoProps,
  getFumoTiming,
} from "game/Modes/BeatsMode/getFumoTiming";
import { ComboCounter } from "game/entities/interface/ComboCounter";
import { SongProgress } from "game/entities/interface/SongProgress";
import { FumobeatSession } from "game/Modes/BeatsMode/FumobeatSession";
import { SongEndScreen } from "game/Modes/BeatsMode/SongEndScreen";

export class BeatsMode extends GameMode {
  private fumobeatSession = new FumobeatSession();
  get fumobeat() {
    return this.fumobeatSession.fumobeat;
  }
  track = this.sound.addCustom("fumobeat", this.fumobeat.file);
  get audioIstance() {
    return this.track.instances[0];
  }
  private player: Player;
  private comboCounter = new ComboCounter(this.fumobeatSession);
  private songEndScreen: SongEndScreen;
  constructor(props: GameModeProps) {
    super(props);
    this.ents.push(new BasicBackground(0, props.view.w, props.view.h));
    this.ents.push(new GameChat(2, 1));
    this.player = new Player(0, 0);
    this.ents.push(this.player);
    this.ents.push(this.comboCounter);
    this.ents.push(new SongProgress(this));
    this.songEndScreen = new SongEndScreen(props.view,this.fumobeatSession);
    this.ents.push(this.songEndScreen);
    this.view.changeFocus(() => {
      const center = this.player.center;
      const tempPoint = Point.temp(center.x, center.y - 2);
      return tempPoint;
    });
  }
  reset() {
    this.time.clearTimeouts();
    this.comboCounter.reset();
  }
  async initFumobeat(fumobeat: Fumobeat) {
    this.track = this.sound.addCustom("fumobeat", fumobeat.file);
    this.reset();
    this.fumobeatSession.reset(fumobeat);
    eventStream.post("loading", true);
    await new Promise((resolve) => {
      this.audioIstance.original.addEventListener("canplay", resolve);
    });
    for (let i = 0; i < fumobeat.beats.length; i++) {
      const beatTiming = fumobeat.beats[i];
      const [fumoProps, delay] = this.getSpawnData({
        left: Math.abs(beatTiming % 2),
      });
      this.time.deltaTimeout(() => {
        const isLastFumo = i === fumobeat.beats.length - 1;
        if (isLastFumo) {
          // If this is the last fumo send the fumobeat-end event
          this.time.deltaTimeout(() => {
            eventStream.post("fumobeat-end"); // TODO: handle this
          }, 1000);
        }
        this.ents.push(applyFumoProps(EntManager.getFumo(), fumoProps));
        eventStream.post("fumo-spawn");
      }, fumobeat.beats[i] - delay);
    }
    this.track.play();
    eventStream.post("loading", false);
  }
  getSpawnData(props: { left: number; seed?: number }) {
    const seedMax = 10000;
    const seed = props?.seed || Math.random() * seedMax;
    const left = props.left;
    const x = this.view.x + (left ? -2 : this.view.w);
    const randHeight = seed % 1;
    const y = this.view.y + (randHeight * this.view.h) / 2;
    const speed = 0.2 + randHeight * 0.1;
    const yVel = -speed;
    const xVel = left ? speed : -speed;
    const rotVel = Math.random() * speed - 0.1;
    const fumoProps = {
      x,
      y,
      yVel,
      xVel,
      left,
      rotVel,
      rot: rotVel * 10,
    };
    return [fumoProps, getFumoTiming(fumoProps, this, this.player)] as const;
  }
  onSwitchOut() {
    this.track.destroy();
    this.reset();
  }
  compute(resume?: boolean) {
    this.initCompute(resume);
    eventStream.read("fumobeat-play", ({ fumobeat }) => {
      this.initFumobeat(fumobeat);
    });
    for (const entity of this.ents) {
      if (entity.removed) continue;
      entity.compute(this);
    }
    for (const entity of this.ents) {
      if (entity.removed) continue;
      entity.render(this.view);
    }
    for (let i = this.ents.length - 1; i >= 0; i--) {
      if (this.ents[i].removed) {
        this.ents.splice(i, 1);
      }
    }
  }
}

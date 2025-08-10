import { Point } from "modules/types/shapes";
import { GameMode, GameModeProps } from "game/Modes/GameMode";
import { Player } from "game/entities/game/Player/Player";
import { Gymbag } from "game/entities/game/Gymbag";
import { EntManager } from "game/entities/game/EntManager";
import { BasicBackground } from "game/entities/interface/BasicBackground";
import { GameChat } from "game/entities/game/GameChat/GameChat";
// import { ComboCounter } from "game/entities/interface/ComboCounter";

export class InfiniteMode extends GameMode {
  spawnerStarted = false;
  constructor(props: GameModeProps) {
    super(props);
    this.ents.push(new BasicBackground(0, props.view.w, props.view.h));
    this.ents.push(new GameChat(2, 1));
    const player = new Player(0, 0);
    // this.ents.push(new ComboCounter());
    this.ents.push(player);
    this.view.changeFocus(() => {
      const center = player.center;
      const tempPoint = Point.temp(center.x, center.y - 2);
      return tempPoint;
    });
  }
  compute(resume?: boolean) {
    this.initCompute(resume);
    if (!this.spawnerStarted) {
      this.spawnerStarted = true;
      this.spawner();
    }
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
  spawner(spree?: { amount: number; seed: number }): void {
    const SPREE_CHANCE = 1 / 100;
    const seedMax = 10000;
    const seed = spree?.seed || Math.random() * seedMax;
    const left = seed > seedMax / 2;
    this.sound.play("_thompf_mp3", {
      pan: left ? -1 : 1,
      resettable: false,
    });
    const x = this.view.x + (left ? -2 : this.view.w);
    const randHeight = seed % 1;
    const y = this.view.y + (randHeight * this.view.h) / 2;
    const speed = 0.2 + randHeight * 0.1;
    const yVel = -speed;
    const xVel = left ? speed : -speed;
    const rotVel = Math.random() * speed - 0.1;
    const entity = Math.random() * 10 > 1 ? EntManager.getFumo() : new Gymbag();
    entity.setProperties({ x, y, xVel, yVel });
    entity.xVel = xVel;
    entity.left = left ? 1 : 0;
    entity.yVel = yVel;
    entity.rot = rotVel * 10;
    entity.rotVel = rotVel;
    if (entity.type === "gymbag") entity.rotVel /= 3;
    this.ents.push(entity);
    let _spree = spree;
    if (!spree && Math.random() < SPREE_CHANCE) {
      _spree = {
        amount: (3 + Math.random() * 5) | 0,
        seed,
      };
    }
    if (!_spree || _spree.amount - 1 <= 0) {
      this.time.deltaTimeout(() => this.spawner(), 200 + Math.random() * 800);
    } else {
      _spree.amount--;
      this.time.deltaTimeout(() => this.spawner(_spree), 150);
    }
  }
}

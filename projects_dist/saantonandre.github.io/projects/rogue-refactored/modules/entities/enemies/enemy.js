import { Entity } from "./../entity.js";
import { HpBar } from "../../vfxs/hpBar.js";
import { DisplayName } from "../../vfxs/displayName.js";
import { vfxsManager } from "./../../vfxs/vfxsManager.js";
import { meta } from "../../meta.js";
import { map } from "./.././../map/mapObject.js"
export class Enemy extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = "enemy";
        this.shadow = true;
        this.maxHp = 10;
        this.atk = 1;
        this.hp = this.maxHp;
        this.dmgFrames = 0;
        this.dead = false;
        this.lv = 1;
        this.expValue = 1;
        this.action = 0;
        this.actionX = [
            [16],
            [16]
        ];
        this.actionY = [
            [0],
            [1]
        ];

        this.hpBar = new HpBar(this);
        this.displayName = new DisplayName(this);
    }
    onHit(source) {
        this.state = "damaged";
        this.damaged = source.attackID;
        this.dmgFrames = 5;
        this.hp -= source.atk;
        // atk text
        vfxsManager.create("DmgText", this, source.atk | 0);
        vfxsManager.create("DmgVfx", this);
        if (this.hp <= 0) {
            this.onDeath(source)
            let recipient = source.owner || source;
            recipient.expManager.update(this);
        }
    }
    onDeath() {
        this.dead = true;
        this.removed = true;
    }
    brain() {}
    computeAction() {}
    onActionEnded() {}
    compute() {
        this.brain();
        this.x += this.xVel * meta.deltaTime;
        this.y += this.yVel * meta.deltaTime;

        map.checkCollisions(this);
        this.hpBar.compute();
        this.displayName.compute();
    }
    render() {
        this.updateSprite();
        this.renderSprite();
        this.hpBar.render();
        this.displayName.render();
    }
}
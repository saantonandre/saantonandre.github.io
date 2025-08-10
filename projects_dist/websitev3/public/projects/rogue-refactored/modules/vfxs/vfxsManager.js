import { DmgText } from "./dmgText.js";
import { DmgVfx } from "./dmgVfx.js";
import { SparklingVfx } from "./sparklingVfx.js";
import { StatusText } from "./statusText.js";
import { meta } from "../meta.js";

class VfxsManager {
    constructor() {
        this.vfxs = [];
        this.maxVfxCount = 20;
        this.maxTxtCount = 20;
        this.maxSparkleCount = 20;

        // Sparkling entitities
        this.sparkleHolders = [];
        this.initialize();
    }
    // Creates / Recycles Vfxs
    create() {
        let args = arguments;
        for (let vfx of this.vfxs) {
            if (vfx.removed && vfx.type == args[0]) {
                vfx.initialize(args);
                // Return if the vfx was created
                return;
            }
        }
        // OtherWise craft it
        switch (args[0]) {
            case "DmgVfx":
                this.vfxs.push(new DmgVfx(0, 0));
                break;
            case "DmgText":
                this.vfxs.push(new DmgText(0, 0));
                break;
            case "StatusText":
                this.vfxs.push(new StatusText(0, 0));
                break;
            case "SparklingVfx":
                this.vfxs.push(new SparklingVfx(0, 0));
                break;
            default:
                return new Error("Tried to create a vfx, but couldn't");
        }
        this.vfxs[this.vfxs.length - 1].initialize(args);
    }
    // Creates a sparkling effect around the selected entity
    sparkleEntity(entity, duration, intensity) {
        let sparkleEntity = {
            entity: entity,
            duration: duration,
            intensity: intensity,
            removed: false
        }
        this.sparkleHolders.push(sparkleEntity);
    }
    computeSparkleEntities() {

        for (let sparkleHolder of this.sparkleHolders) {
            if (sparkleHolder.duration <= 0) {
                sparkleHolder.removed = true;
                continue;
            }
            for (let j = 0; j < sparkleHolder.intensity; j++) {
                this.create("SparklingVfx", sparkleHolder.entity, 0)
            }
            sparkleHolder.duration -= meta.deltaTime;

        }
        // Removes the finished Vfxs
        for (let i = this.sparkleHolders.length - 1; i >= 0; i--) {
            if (this.sparkleHolders[i].removed) {
                this.sparkleHolders.splice(i, 1);
            }
        }
    }
    removeAll() {
        for (let vfx of this.vfxs) {
            vfx.removed = true;
        }
    }
    initialize() {
        this.vfxs = [];
        let newVfx;
        for (let i = 0; i < this.maxTxtCount; i++) {
            newVfx = new DmgText(0, 0);
            newVfx.removed = true;
            this.vfxs.push(newVfx);
        }
        for (let i = 0; i < this.maxVfxCount; i++) {
            newVfx = new DmgVfx(0, 0);
            newVfx.removed = true;
            this.vfxs.push(newVfx);
        }
        for (let i = 0; i < this.maxSparkleCount; i++) {
            newVfx = new SparklingVfx(0, 0);
            newVfx.removed = true;
            this.vfxs.push(newVfx);
        }
        for (let i = 0; i < this.maxStatTextCount; i++) {
            newVfx = new StatusText(0, 0);
            newVfx.removed = true;
            this.vfxs.push(newVfx);
        }
    }
    compute() {
        for (let vfx of this.vfxs) {
            if (vfx.removed) {
                continue;
            }
            vfx.compute();
        }
        // Computes the sparkling Vfx
        this.computeSparkleEntities();
    }
    render() {
        for (let vfx of this.vfxs) {
            if (vfx.removed) {
                continue;
            }
            vfx.render();
        }
    }
}

export const vfxsManager = new VfxsManager();
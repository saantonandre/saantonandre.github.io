/** 
 *  Acts as intermediate between the manager and the entities,
 *  the entities have a reference to this class OBJECT 
 */
import * as Vfxs from "./vfxs";
import { Entity} from "../entity"
export { vfxManager, Vfxs };

type VfxClass= keyof typeof Vfxs
/** Singleton */
class VfxManager {
    /** Instead of being deleted, removed Vfxs gets moved here to be reused later, gets populated by the gameDirector */
    recyclePool:Vfxs.SpriteVfx[] = [];
    environment:Vfxs.SpriteVfx[] = [];
    /** Contains vfx classes declarations */
    vfxClasses = {...Vfxs};
    constructor() {
    }
    setEnvironment(environment:Vfxs.SpriteVfx[]) {
        this.environment = environment;
    }
    /** Returns a recycled vfx or FALSE */
    getRecycledVfx(vfxName:string, source:Entity) {
        for (let i = this.recyclePool.length - 1; i >= 0; i--) {
            if (this.recyclePool[i].name === vfxName) {
                /** Found a matching Vfx */
                this.recyclePool[i].reset(source);
                return this.recyclePool.splice(i, 1)[0];
            }
        }
        /** Matching Vfx was not found */
        return false;
    }
    /** Returns a Vfx of the requested type and pushes it into the current level entities, this function gets imported and called by entities */
    create = (vfxName:VfxClass, source:Entity) => {
        let vfx = this.getRecycledVfx(vfxName, source) || new this.vfxClasses[vfxName](source);
        this.environment.push(vfx);
        return vfx;
    }
}
const vfxManager = new VfxManager();
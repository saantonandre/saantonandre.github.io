export class Debug {
    constructor() {
        this.on = false;
    }
    log(arg) {
        if (this.on) {
            console.log(arg);
        }
    }
}
export const debug = new Debug();
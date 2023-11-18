class UI {
    constructor(x, y, source) {
        this.sheet = id("sheet");
        this.x = x;
        this.y = y;
        this.source = source;

        this.indicatorAction = 0;

        this.indicatorOffsetX = 0; // (pixels)
        this.indicatorOffsetY = 6; // (pixels)

        this.baseX = [0, 64]; // (pixels)
        this.baseY = 352; // (pixels)
        this.baseW = 50; // (pixels)
        this.baseH = 43; // (pixels)

        this.indicatorX = [128, 192]; // (pixels)
        this.indicatorY = 352; // (pixels)
        this.indicatorW = 50; // (pixels)
        this.indicatorH = 32; // (pixels)
        this.speedH = 0;

        this.maxVel = 0.15;
        this.overSpeed = false;


        this.glassOffsetX = 8; // (pixels)
        this.glassOffsetY = 4; // (pixels)
        this.glassBaseX = [
            [0, 48],
            [96, 144]
        ] // (pixels)
        this.glassBaseY = 304; // (pixels)
        this.glassBaseW = 34; // (pixels)
        this.glassBaseH = 34; // (pixels)
        this.glassColor = 0;
        this.glassAction = 0;
        this.glassFaceX = [192, 240]; // (pixels)
        this.glassHighlightX = [288, 320]; // (pixels)

        this.maxRotVel = 0.15;
        this.overRotSpeed = false;

        this.pulseCD = 20;
        this.pulseCounter = 0;
        this.pulseActive = 0;

        this.minimap = {
            x: 64,
            y: 0,
            offsetX: -10,
            offsetY: 10,
        }
        this.minimap.x = meta.baseTilesWidth * meta.tileSize;
        this.playerPulse = false;
        this.playerPulseCd = 20;
    }
    compute() {
        // Compute speed indicator
        let vel = Math.abs(this.source.xVel) + Math.abs(this.source.yVel);
        if (vel > this.maxVel) {
            vel = this.maxVel;
            this.overSpeed = true;
        } else {
            this.overSpeed = false;
        }
        this.speedH = vel / this.maxVel;

        // Compute rot indicator
        if (Math.abs(this.source.rotVel) > this.maxRotVel) {
            this.overRotSpeed = true;
        } else {
            this.overRotSpeed = false;
        }
        if ((this.source.rot | 0) % 2 != 0) {
            this.glassAction = 1;
        } else {
            this.glassAction = 0;
        }

        if (this.overSpeed) {
            this.indicatorAction = 1;
        } else {
            this.indicatorAction = 0;
        }

        // Compute pulsing
        if (this.overRotSpeed || this.overSpeed) {
            this.pulseCounter += meta.deltaTime;
            if (this.pulseCounter > this.pulseCD) {
                this.pulseCounter = 0;
                if (this.pulseActive) {
                    this.pulseActive = false;
                } else {
                    this.pulseActive = true;
                }
            }
        }
        if (this.overRotSpeed) {
            if (this.pulseActive) {
                this.glassColor = 1;
            } else {
                this.glassColor = 0;
            }
        } else {
            this.glassAction = 0;
            this.glassColor = 0;
        }
        if (this.source.damaged) {
            this.glassColor = 1;
            this.indicatorAction = 1;
        }
    }
    render() {
        // Draw Base
        c.drawImage(
            this.sheet,
            this.baseX[this.indicatorAction],
            this.baseY,
            this.baseW,
            this.baseH,
            (this.x * meta.tileSize) * meta.baseRatio,
            this.y * meta.tileSize * meta.baseRatio,
            this.baseW * meta.baseRatio,
            this.baseH * meta.baseRatio
        )

        // Draw Indicator over base
        if (!this.pulseActive || !this.overSpeed) {
            c.drawImage(
                this.sheet,
                this.indicatorX[this.indicatorAction],
                this.indicatorY + (this.indicatorH * (1 - this.speedH)),
                this.indicatorW,
                this.indicatorH * this.speedH,
                (this.x * meta.tileSize + this.indicatorOffsetX) * meta.baseRatio,
                (this.y * meta.tileSize + this.indicatorOffsetY + this.indicatorH * (1 - this.speedH)) * meta.baseRatio,
                this.indicatorW * meta.baseRatio,
                this.indicatorH * this.speedH * meta.baseRatio
            )
        }

        // Draw glass base
        c.drawImage(
            this.sheet,
            this.glassBaseX[this.glassColor][this.glassAction],
            this.glassBaseY,
            this.glassBaseW,
            this.glassBaseH,
            (this.x * meta.tileSize + this.glassOffsetX) * meta.baseRatio,
            (this.y * meta.tileSize + this.glassOffsetY) * meta.baseRatio,
            this.glassBaseW * meta.baseRatio,
            this.glassBaseH * meta.baseRatio
        )

        c.save();
        c.translate((this.x * meta.tileSize + this.glassOffsetX + this.glassBaseW / 2) * meta.baseRatio,
            (this.y * meta.tileSize + this.glassOffsetY + this.glassBaseH / 2) * meta.baseRatio);
        c.rotate(this.source.rot + Math.PI / 2)
        // Draw glass face
        c.drawImage(
            this.sheet,
            this.glassFaceX[this.glassColor],
            this.glassBaseY,
            this.glassBaseW,
            this.glassBaseH,
            -this.glassBaseW / 2 * meta.baseRatio,
            -this.glassBaseH / 2 * meta.baseRatio,
            this.glassBaseW * meta.baseRatio,
            this.glassBaseH * meta.baseRatio
        )
        c.restore();

        // Draw glass highlight
        c.drawImage(
            this.sheet,
            this.glassHighlightX[this.glassAction],
            this.glassBaseY,
            this.glassBaseW,
            this.glassBaseH,
            (this.x * meta.tileSize + this.glassOffsetX) * meta.baseRatio,
            (this.y * meta.tileSize + this.glassOffsetY) * meta.baseRatio,
            this.glassBaseW * meta.baseRatio,
            this.glassBaseH * meta.baseRatio
        )

        // Renders the minimap
        this.renderMinimap()
    }
    renderMinimap() {
        // Tiles
        c.globalAlpha = 0.7;
        c.fillStyle = "#2f5753";
        for (let i = 0; i < map.tiles.length; i++) {
            c.fillRect(
                (this.minimap.x - map.levelWidth + this.minimap.offsetX + map.tiles[i].x) * meta.baseRatio,
                (this.minimap.y + this.minimap.offsetY + map.tiles[i].y) * meta.baseRatio,
                map.tiles[i].w * meta.baseRatio,
                map.tiles[i].h * meta.baseRatio
            )
        }
        // Player
        this.playerPulseCd -= meta.deltaTime;
        if (this.playerPulseCd <= 0) {
            this.playerPulse = !this.playerPulse;
            this.playerPulseCd = 60;
        }

        c.fillStyle = this.playerPulse ? "#ffee83" : "#63ab3f";
        c.fillRect(
            (this.minimap.x - map.levelWidth + this.minimap.offsetX + player.x) * meta.baseRatio,
            (this.minimap.y + this.minimap.offsetY + player.y) * meta.baseRatio,
            player.w * meta.baseRatio,
            player.h * meta.baseRatio
        )
        c.globalAlpha = 1;
    }
}
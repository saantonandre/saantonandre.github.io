class UserInterface {
    constructor(source) {
        /*
            TODO:
            gradual damaged bar
        */
        this.source = source;
        this.fontSize = 7;

        this.hpIcon = {
            spriteX: [
                [5]
            ],
            spriteY: [
                [11]
            ],
            x: 0.5,
            y: 0.5,
            w: 1,
            h: 1,
        };
        this.hpBar = {
            spriteX: [
                [6],
                [9]
            ],
            spriteY: [
                [11],
                [11]
            ],
            x: 1.5,
            y: 0.5,
            w: 3,
            h: 1,
            prevRatio: 0
        };

        this.manaIcon = {
            spriteX: [
                [5]
            ],
            spriteY: [
                [12]
            ],
            x: 4.5,
            y: 0.5,
            w: 1,
            h: 1,
        };
        this.manaBar = {
            spriteX: [
                [6],
                [9]
            ],
            spriteY: [
                [12],
                [12]
            ],
            x: 5.5,
            y: 0.5,
            w: 3,
            h: 1,
            prevRatio: 0
        };

        this.damagedBar = {
            spriteX: [
                [9],
            ],
            spriteY: [
                [13],
            ]
        };

        this.expIcon = {
            spriteX: [
                [12],
            ],
            spriteY: [
                [11]
            ],
            x: 9,
            y: 0.5,
            w: 1,
            h: 1,
        };
        this.expBar = {
            spriteX: [
                [13],
                [13]
            ],
            spriteY: [
                [11],
                [12]
            ],
            x: 10,
            y: 0.5,
            w: 5,
            h: 1,
        };
        this.floorIcon = {
            spriteX: [
                [12],
            ],
            spriteY: [
                [14]
            ],
            x: 17,
            y: 0.4,
            w: 2,
            h: 1,
        };
        this.lvlIcon = {
            spriteX: [
                [12],
            ],
            spriteY: [
                [12]
            ],
            x: 15,
            y: 0.15,
            w: 1,
            h: 1,
        };

        this.settingsIcon = {
            action: 0,
            spriteX: [
                [7],
                [7]
            ],
            spriteY: [
                [8],
                [9]
            ],
            x: 23.5,
            y: 0.5,
            w: 1,
            h: 1,
        };

        this.inventoryIcon = {
            action: 0,
            spriteX: [
                [6],
                [6]
            ],
            spriteY: [
                [8],
                [9]
            ],
            x: 22,
            y: 0.5,
            w: 1,
            h: 1,
        };

        this.equipmentIcon = {
            action: 0,
            spriteX: [
                [5],
                [5]
            ],
            spriteY: [
                [8],
                [9]
            ],
            x: 20.5,
            y: 0.5,
            w: 1,
            h: 1,
        };

        this.hpRatio = this.source.hp / this.source.maxHp;
        this.manaRatio = this.source.mana / this.source.maxMana;
        this.expRatio = this.source.exp / this.source.maxExp;

        this.hpBar.prevRatio = this.hpRatio;
        this.manaBar.prevRatio = this.manaRatio;
    }
    compute() {

        this.hpRatio = this.source.hp / this.source.maxHp;
        this.manaRatio = this.source.mana / this.source.maxMana;
        this.expRatio = this.source.exp / this.source.maxExp;
        // Computes the white damage gradual decrease
        if (this.hpBar.prevRatio > this.hpRatio) {
            this.hpBar.prevRatio -= meta.deltaTime / 400;
        }
        if (this.hpBar.prevRatio < this.hpRatio) {
            this.hpBar.prevRatio = this.hpRatio;
        }

        if (this.manaBar.prevRatio > this.manaRatio) {
            this.manaBar.prevRatio -= meta.deltaTime / 400;
        }
        if (this.manaBar.prevRatio < this.manaRatio) {
            this.manaBar.prevRatio = this.manaRatio;
        }

    }
    render() {
        this.renderHpBar();
        this.renderManaBar();
        this.renderExpBar();
        this.renderSettingsIcon();
        this.renderInventoryIcon();
        this.renderEquipmentIcon();
        this.renderFloorIcon();
    }
    renderSettingsIcon() {
        this.settingsIcon.action = pointSquareCol(mouse, this.settingsIcon) ? 1 : 0;
        // renders icon
        c.drawImage(
            SHEET,
            this.settingsIcon.spriteX[this.settingsIcon.action][0] * meta.tileSize,
            this.settingsIcon.spriteY[this.settingsIcon.action][0] * meta.tileSize,
            this.settingsIcon.w * meta.tileSize,
            this.settingsIcon.h * meta.tileSize,
            this.settingsIcon.x * meta.tileSize * meta.baseRatio,
            this.settingsIcon.y * meta.tileSize * meta.baseRatio,
            this.settingsIcon.w * meta.tileSize * meta.baseRatio,
            this.settingsIcon.h * meta.tileSize * meta.baseRatio
        );
    }
    renderInventoryIcon() {

        this.inventoryIcon.action = pointSquareCol(mouse, this.inventoryIcon) ? 1 : 0;
        // renders icon
        c.drawImage(
            SHEET,
            this.inventoryIcon.spriteX[this.inventoryIcon.action][0] * meta.tileSize,
            this.inventoryIcon.spriteY[this.inventoryIcon.action][0] * meta.tileSize,
            this.inventoryIcon.w * meta.tileSize,
            this.inventoryIcon.h * meta.tileSize,
            this.inventoryIcon.x * meta.tileSize * meta.baseRatio,
            this.inventoryIcon.y * meta.tileSize * meta.baseRatio,
            this.inventoryIcon.w * meta.tileSize * meta.baseRatio,
            this.inventoryIcon.h * meta.tileSize * meta.baseRatio
        );
    }
    renderEquipmentIcon() {
        this.equipmentIcon.action = pointSquareCol(mouse, this.equipmentIcon) ? 1 : 0;
        // renders icon
        c.drawImage(
            SHEET,
            this.equipmentIcon.spriteX[this.equipmentIcon.action][0] * meta.tileSize,
            this.equipmentIcon.spriteY[this.equipmentIcon.action][0] * meta.tileSize,
            this.equipmentIcon.w * meta.tileSize,
            this.equipmentIcon.h * meta.tileSize,
            this.equipmentIcon.x * meta.tileSize * meta.baseRatio,
            this.equipmentIcon.y * meta.tileSize * meta.baseRatio,
            this.equipmentIcon.w * meta.tileSize * meta.baseRatio,
            this.equipmentIcon.h * meta.tileSize * meta.baseRatio
        );
    }
    renderHpBar() {
        // variables

        // renders icon
        c.drawImage(
            SHEET,
            this.hpIcon.spriteX[0][0] * meta.tileSize,
            this.hpIcon.spriteY[0][0] * meta.tileSize,
            this.hpIcon.w * meta.tileSize,
            this.hpIcon.h * meta.tileSize,
            this.hpIcon.x * meta.tileSize * meta.baseRatio,
            this.hpIcon.y * meta.tileSize * meta.baseRatio,
            this.hpIcon.w * meta.tileSize * meta.baseRatio,
            this.hpIcon.h * meta.tileSize * meta.baseRatio
        );
        // renders container
        c.drawImage(
            SHEET,
            this.hpBar.spriteX[0][0] * meta.tileSize,
            this.hpBar.spriteY[0][0] * meta.tileSize,
            this.hpBar.w * meta.tileSize,
            this.hpBar.h * meta.tileSize,
            this.hpBar.x * meta.tileSize * meta.baseRatio,
            this.hpBar.y * meta.tileSize * meta.baseRatio,
            this.hpBar.w * meta.tileSize * meta.baseRatio,
            this.hpBar.h * meta.tileSize * meta.baseRatio
        );
        // renders damagedBar
        c.drawImage(
            SHEET,
            this.damagedBar.spriteX[0][0] * meta.tileSize,
            this.damagedBar.spriteY[0][0] * meta.tileSize,
            this.hpBar.w * meta.tileSize * this.hpBar.prevRatio,
            this.hpBar.h * meta.tileSize,
            this.hpBar.x * meta.tileSize * meta.baseRatio,
            this.hpBar.y * meta.tileSize * meta.baseRatio,
            this.hpBar.w * meta.tileSize * meta.baseRatio * this.hpBar.prevRatio,
            this.hpBar.h * meta.tileSize * meta.baseRatio
        );
        // renders bar
        c.drawImage(
            SHEET,
            this.hpBar.spriteX[1][0] * meta.tileSize,
            this.hpBar.spriteY[1][0] * meta.tileSize,
            this.hpBar.w * meta.tileSize * this.hpRatio,
            this.hpBar.h * meta.tileSize,
            this.hpBar.x * meta.tileSize * meta.baseRatio,
            this.hpBar.y * meta.tileSize * meta.baseRatio,
            this.hpBar.w * meta.tileSize * meta.baseRatio * this.hpRatio,
            this.hpBar.h * meta.tileSize * meta.baseRatio
        );
        // renders text
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = "#ad2f45";
        c.font =
            "bold " + Math.round(this.fontSize * meta.baseRatio) + "px " + meta.font;
        c.fillText(
            this.source.hp + "/" + this.source.maxHp,
            (this.hpBar.x + this.hpBar.w / 2) * meta.tileSize * meta.baseRatio,
            this.hpBar.y * meta.tileSize * meta.baseRatio
        );
    }
    renderManaBar() {
        // variables

        // renders icond
        c.drawImage(
            SHEET,
            this.manaIcon.spriteX[0][0] * meta.tileSize,
            this.manaIcon.spriteY[0][0] * meta.tileSize,
            this.manaIcon.w * meta.tileSize,
            this.manaIcon.h * meta.tileSize,
            this.manaIcon.x * meta.tileSize * meta.baseRatio,
            this.manaIcon.y * meta.tileSize * meta.baseRatio,
            this.manaIcon.w * meta.tileSize * meta.baseRatio,
            this.manaIcon.h * meta.tileSize * meta.baseRatio
        );
        // renders container
        c.drawImage(
            SHEET,
            this.manaBar.spriteX[0][0] * meta.tileSize,
            this.manaBar.spriteY[0][0] * meta.tileSize,
            this.manaBar.w * meta.tileSize,
            this.manaBar.h * meta.tileSize,
            this.manaBar.x * meta.tileSize * meta.baseRatio,
            this.manaBar.y * meta.tileSize * meta.baseRatio,
            this.manaBar.w * meta.tileSize * meta.baseRatio,
            this.manaBar.h * meta.tileSize * meta.baseRatio
        );
        // renders damagedBar
        c.drawImage(
            SHEET,
            this.damagedBar.spriteX[0][0] * meta.tileSize,
            this.damagedBar.spriteY[0][0] * meta.tileSize,
            this.manaBar.w * meta.tileSize * this.manaBar.prevRatio,
            this.manaBar.h * meta.tileSize,
            this.manaBar.x * meta.tileSize * meta.baseRatio,
            this.manaBar.y * meta.tileSize * meta.baseRatio,
            this.manaBar.w * meta.tileSize * meta.baseRatio * this.manaBar.prevRatio,
            this.manaBar.h * meta.tileSize * meta.baseRatio
        );
        // renders bar
        c.drawImage(
            SHEET,
            this.manaBar.spriteX[1][0] * meta.tileSize,
            this.manaBar.spriteY[1][0] * meta.tileSize,
            this.manaBar.w * meta.tileSize * this.manaRatio,
            this.manaBar.h * meta.tileSize,
            this.manaBar.x * meta.tileSize * meta.baseRatio,
            this.manaBar.y * meta.tileSize * meta.baseRatio,
            this.manaBar.w * meta.tileSize * meta.baseRatio * this.manaRatio,
            this.manaBar.h * meta.tileSize * meta.baseRatio
        );

        // renders text
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = "#4fa4b8";
        c.font =
            "bold " + Math.round(this.fontSize * meta.baseRatio) + "px " + meta.font;
        c.fillText(
            this.source.mana + "/" + this.source.maxMana,
            (this.manaBar.x + this.manaBar.w / 2) * meta.tileSize * meta.baseRatio,
            this.manaBar.y * meta.tileSize * meta.baseRatio
        );
    }
    renderExpBar() {
        // variables

        // renders icon
        c.drawImage(
            SHEET,
            this.expIcon.spriteX[0][0] * meta.tileSize,
            this.expIcon.spriteY[0][0] * meta.tileSize,
            this.expIcon.w * meta.tileSize,
            this.expIcon.h * meta.tileSize,
            this.expIcon.x * meta.tileSize * meta.baseRatio,
            this.expIcon.y * meta.tileSize * meta.baseRatio,
            this.expIcon.w * meta.tileSize * meta.baseRatio,
            this.expIcon.h * meta.tileSize * meta.baseRatio
        );
        // renders container
        c.drawImage(
            SHEET,
            this.expBar.spriteX[0][0] * meta.tileSize,
            this.expBar.spriteY[0][0] * meta.tileSize,
            this.expBar.w * meta.tileSize,
            this.expBar.h * meta.tileSize,
            this.expBar.x * meta.tileSize * meta.baseRatio,
            this.expBar.y * meta.tileSize * meta.baseRatio,
            this.expBar.w * meta.tileSize * meta.baseRatio,
            this.expBar.h * meta.tileSize * meta.baseRatio
        );
        // renders bar
        c.drawImage(
            SHEET,
            this.expBar.spriteX[1][0] * meta.tileSize,
            this.expBar.spriteY[1][0] * meta.tileSize,
            this.expBar.w * meta.tileSize * this.expRatio,
            this.expBar.h * meta.tileSize,
            this.expBar.x * meta.tileSize * meta.baseRatio,
            this.expBar.y * meta.tileSize * meta.baseRatio,
            this.expBar.w * meta.tileSize * meta.baseRatio * this.expRatio,
            this.expBar.h * meta.tileSize * meta.baseRatio
        );

        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = "#63ab3f";
        c.font = "bold " + Math.round(this.fontSize * meta.baseRatio) + "px " + meta.font;
        c.fillText(
            this.source.exp + "/" + this.source.maxExp,
            (this.expBar.x + this.expBar.w / 2) * meta.tileSize * meta.baseRatio,
            (this.expBar.y + 0.01) * meta.tileSize * meta.baseRatio
        );
        // renders lvl icon
        c.drawImage(
            SHEET,
            this.lvlIcon.spriteX[0][0] * meta.tileSize,
            this.lvlIcon.spriteY[0][0] * meta.tileSize,
            this.lvlIcon.w * meta.tileSize,
            this.lvlIcon.h * meta.tileSize,
            this.lvlIcon.x * meta.tileSize * meta.baseRatio,
            this.lvlIcon.y * meta.tileSize * meta.baseRatio,
            this.lvlIcon.w * meta.tileSize * meta.baseRatio,
            this.lvlIcon.h * meta.tileSize * meta.baseRatio
        );
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = "#63ab3f";
        c.font = "bold " + Math.round(this.fontSize * meta.baseRatio) + "px " + meta.font;
        c.fillText(
            this.source.lv,
            (this.lvlIcon.x + this.lvlIcon.w / 2) * meta.tileSize * meta.baseRatio,
            (this.lvlIcon.y + this.lvlIcon.h) * meta.tileSize * meta.baseRatio
        );
    }
    renderFloorIcon() {
        // renders icon
        c.drawImage(
            SHEET,
            this.floorIcon.spriteX[0][0] * meta.tileSize,
            this.floorIcon.spriteY[0][0] * meta.tileSize,
            this.floorIcon.w * meta.tileSize,
            this.floorIcon.h * meta.tileSize,
            this.floorIcon.x * meta.tileSize * meta.baseRatio,
            this.floorIcon.y * meta.tileSize * meta.baseRatio,
            this.floorIcon.w * meta.tileSize * meta.baseRatio,
            this.floorIcon.h * meta.tileSize * meta.baseRatio
        );
        c.textAlign = "left";
        c.textBaseline = "middle";
        c.fillStyle = "#fef3c0";
        c.font = "bold " + Math.round(this.fontSize * meta.baseRatio) + "px " + meta.font;
        c.fillText(
            map.currentFloor,
            (this.floorIcon.x + this.floorIcon.w * 1.05) * meta.tileSize * meta.baseRatio,
            (this.floorIcon.y + this.floorIcon.h / 1.7) * meta.tileSize * meta.baseRatio
        );
    }
}
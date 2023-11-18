//COLLISION POINTS
this.colPoint.L = false;
this.colPoint.R = false;
this.colPoint.B = false;


for (let j = 0; j < map.length; j++) {
    if (isOutOfScreen(map[j])) {
        continue;
    }
    //checks for blocks to the right
    if (pointSquareCol({
            x: this.x + this.w / 2 + 0.7,
            y: this.y + this.h / 2
        }, map[j])) {
        this.colPoint.R = true;
    }
    //checks for blocks to the left
    if (pointSquareCol({
            x: this.x + this.w / 2 - 0.7,
            y: this.y + this.h / 2
        }, map[j])) {
        this.colPoint.L = true;
    }
    //checks for blocks to the bottom
    if (pointSquareCol({
            x: this.x + this.w / 2,
            y: this.y + this.h / 2 + 0.7
        }, map[j])) {
        this.colPoint.B = true;
    }

}
for (let j = 0; j < specialTiles.length; j++) {
    if (isOutOfScreen(specialTiles[j])) {
        continue;
    }
    //checks for blocks to the right
    if (pointSquareCol({
            x: this.x + this.w / 2 + 0.7,
            y: this.y + this.h / 2
        }, specialTiles[j])) {
        this.colPoint.R = true;
    }
    //checks for blocks to the left
    if (pointSquareCol({
            x: this.x + this.w / 2 - 0.7,
            y: this.y + this.h / 2
        }, specialTiles[j])) {
        this.colPoint.L = true;
    }
    //checks for blocks to the bottom
    if (pointSquareCol({
            x: this.x + this.w / 2,
            y: this.y + this.h / 2 + 0.7
        }, specialTiles[j])) {
        this.colPoint.B = true;
    }

}
if (stats.colPoints) {
    this.colPoint.R ? c.fillStyle = "red" : c.fillStyle = "white";
    c.fillRect(
        (this.x + this.w / 2 + 0.7 + mapX) * ratio | 0,
        (this.y + this.h / 2 + mapY) * ratio | 0,
        (0.1) * ratio | 0,
        (0.1) * ratio | 0
    );
    this.colPoint.L ? c.fillStyle = "red" : c.fillStyle = "white";
    c.fillRect(
        (this.x + this.w / 2 - 0.7 + mapX) * ratio | 0,
        (this.y + this.h / 2 + mapY) * ratio | 0,
        (0.1) * ratio | 0,
        (0.1) * ratio | 0
    );
    this.colPoint.B ? c.fillStyle = "red" : c.fillStyle = "white";
    c.fillRect(
        (this.x + this.w / 2 + mapX) * ratio | 0,
        (this.y + this.h / 2 + 0.7 + mapY) * ratio | 0,
        (0.1) * ratio | 0,
        (0.1) * ratio | 0
    );
}


if (this.col.R > this.hitbox.w / 2 + Math.abs(this.xVel + this.xVelExt)) {
    if (this.col.T > this.col.B) {
        this.col.T += this.col.R;
        this.col.R = 0;
    } else {
        this.col.B += this.col.R;
        this.col.R = 0;
    }
}
if (this.col.L > this.hitbox.w / 2 + Math.abs(this.xVel + this.xVelExt)) {
    if (this.col.T > this.col.B) {
        this.col.T += this.col.L;
        this.col.L = 0;
    } else {
        this.col.B += this.col.L;
        this.col.L = 0;
    }
}
if (this.col.B > this.hitbox.w / 2 + Math.abs(this.yVel + this.yVelExt)) {
    this.col.T = 0;
}
if (this.col.T > this.hitbox.w / 2 + Math.abs(this.yVel + this.yVelExt)) {
    this.col.B = 0;
}

if (this.col.L && this.colPoint.L) {
    if (this.col.R) {
        this.grounded = true;
    }
    this.x += this.col.L;
    if (this.dash) {
        this.dash = false;
        this.dashCd = true;
    }
    if (this.xVelExt < 0 && this.colPoint.L) {
        this.xVelExt = 0;
    }
    if (this.xVel < 0 && this.colPoint.L) {
        this.xVel = 0;
    }

}
if (this.col.R && this.colPoint.R) {
    if (this.col.L) {
        this.grounded = true;
    }
    this.x -= this.col.R;
    if (this.dash) {
        this.dash = false;
        this.dashCd = true;
    }
    if (this.xVelExt > 0 && this.colPoint.R) {
        this.xVelExt = 0;
    }
    if (this.xVel > 0 && this.colPoint.R) {
        this.xVel = 0;
    }

}
if (this.col.T) {
    this.y += this.col.T;
    if (this.yVel < 0) {
        this.yVel = 0;
    }
    if (this.yVelExt < 0) {
        this.yVelExt = 0;
    }
    if (this.dash) {
        this.dash = false;
        this.dashCd = true;
    }

}
if (this.col.B) {
    this.y -= (this.col.B - 0.03);
    if (this.jumpCounter < 9 && this.yVel < 0) {
        this.grounded = false;
    } else {
        if (this.lastCollided !== "bouncy") {
            this.grounded = true;
        }
        if (this.yVel > 0) {
            this.yVel = 0;
        }
        if (this.dashCd || this.dash) {
            this.dashCd = false;
            this.dash = false;
        }
    }
}

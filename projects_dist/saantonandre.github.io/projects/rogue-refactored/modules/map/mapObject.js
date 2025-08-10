"use strict"
import { MapGenerator } from "./mapGenerator/mapGenerator.js";
import { LevelGenerator } from "./levelGenerator/levelGenerator.js";
import { Block, Slime, Portal } from "./../entities/entities.js";

import { meta } from "../meta.js";
import { vfxsManager } from "./../vfxs/vfxsManager.js";
import { c, canvas } from "./../drawingContext.js"
import { SHEET } from "./../assets.js"
import { collided, colCheck, assembleChunk } from "./../physics.js";
import { player } from "./../entities/player/player.js";

class MapObject {
    constructor() {
        this.w = 11;
        this.h = 11;
        this.rooms = 6;

        this.levelW = 23;
        this.levelH = 17;
        this.levelX = (meta.tilesWidth - this.levelW) / 2;
        this.levelY = (meta.tilesHeight - this.levelH) / 2;

        this.x = 0;
        this.y = 0;
        this.map = [];
        this.entities = [];

        this.start = [0, 0];

        this.currentFloor = 1;
        this.currentLevel = [0, 0];

        this.mapGen = new MapGenerator();
        this.levelGen = new LevelGenerator();
        this.cameraFocus = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        this.lockedAngles = true;
        this.zoom = false;
        this.initialize();
    }
    computeCamera() {
        /*
        if (this.cameraFocus) {
            this.x = -(this.cameraFocus.x + this.cameraFocus.w / 2 - meta.tilesWidth / 2);
            this.y = -(this.cameraFocus.y + this.cameraFocus.h / 2 - meta.tilesHeight / 2);
        }
        //*/
        // Compute the ratio
        if (this.zoom) {
            if (meta.ratio < meta.baseRatio * 2) {
                meta.ratio += (0.005 + (meta.baseRatio * 2 - meta.ratio) / 22) * meta.deltaTime;
            }

            if (meta.ratio > meta.baseRatio * 2) {
                meta.ratio = meta.baseRatio * 2;
            }

            meta.tilesWidth = meta.baseTilesWidth * (meta.baseRatio / meta.ratio);
            meta.tilesHeight = meta.baseTilesHeight * (meta.baseRatio / meta.ratio);
            //this.levelX = (meta.tilesWidth - this.levelW) / 2;
            //this.levelY = (meta.tilesHeight - this.levelH) / 2;

        } else {
            if (meta.ratio != meta.baseRatio) {
                meta.ratio = meta.baseRatio;
                meta.tilesWidth = meta.baseTilesWidth;
                meta.tilesHeight = meta.baseTilesHeight;
                //this.levelX = (meta.tilesWidth - this.levelW) / 2;
                //this.levelY = (meta.tilesHeight - this.levelH) / 2;
            }
        }
        // Updates meta pos

        if (this.cameraFocus) {
            let xx = -(this.cameraFocus.x + this.cameraFocus.w / 2 - (meta.tilesWidth) / 2)
            let yy = -(this.cameraFocus.y + this.cameraFocus.h / 2 - (meta.tilesHeight) / 2)
            this.x += (xx - this.x) / 15 * meta.deltaTime;
            this.y += (yy - this.y) / 15 * meta.deltaTime;
        }
        if (this.lockedAngles) {
            // left boundary

            if (-this.x < -this.levelX) {
                this.x = this.levelX;
            }
            // top boundary
            // +0.5 to counterweight the top UI 
            if (-this.y < -this.levelY + 0.5) {
                this.y = this.levelY + 0.5;
            }

            // Right boundary
            if (-this.x > this.levelX + this.levelW - meta.tilesWidth) {
                this.x = -(this.levelX + this.levelW - meta.tilesWidth);
            }
            // Down boundary
            if (-this.y > this.levelY + this.levelH - meta.tilesHeight) {
                this.y = -(this.levelY + this.levelH - meta.tilesHeight);
            }
        }
    }
    // Generate the map
    initialize() {
        this.map = this.mapGen.generate(this.w, this.h, this.rooms);
        // Iterate the rooms inside the map
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if (!this.map[i][j]) {
                    continue;
                }
                // Initializes the portals array
                this.map[i][j].portals = [];
                // Parses the bidimensional array into level entities
                this.map[i][j].entities = this.parseRoom(
                    this.levelGen.generate(this.levelW, this.levelH, this.map[i][j].links, this.map[i][j].type)
                );
                // Creates a list of portals for the level
                for (let k = 0; k < this.map[i][j].entities.length; k++) {
                    if (this.map[i][j].entities[k].type == "portal") {
                        this.map[i][j].portals.push(this.map[i][j].entities[k]);
                    }
                }

                if (this.map[i][j].type === 1) {
                    this.currentLevel = [i, j];
                    this.map[this.currentLevel[0]][this.currentLevel[1]].revealed = true;
                    this.entities = this.map[this.currentLevel[0]][this.currentLevel[1]].entities;
                    // Inserts the player
                    this.entities.push(player);
                }
            }
        }
    }
    // Translates the level to game entities
    parseRoom(room) {
        let entities = [];
        let entity;
        for (let x = 0; x < room.length; x++) {
            for (let y = 0; y < room[x].length; y++) {
                switch (room[x][y].type) {
                    case 0:
                        break;
                    case 1:
                        entity = new Block(x, y);
                        entity.tile = room[x][y].tile;
                        entities.push(entity);
                        break;
                    case 2:
                        entity = new Portal(x, y, room[x][y].dir, room[x][y].id);
                        entities.push(entity);
                        break;
                    case 3:
                        entity = new Block(x, y);
                        entity.tile = room[x][y].tile;
                        entities.push(entity);
                        break;
                    case 10:
                        entity = new Slime(x, y);
                        entities.push(entity);
                        break;
                }
            }
        }
        // Merges toghether the entities with the same ID, like Portals
        return this.mergeSameIdEntities(entities);
    }
    mergeSameIdEntities(entities) {
        let mergedEntities = [];
        for (let i = 0; i < entities.length; i++) {
            if (!(entities[i].id >= 0)) {
                continue;
            }
            mergedEntities.push(entities.splice(i, 1)[0])
            i--;
        }
        for (let i = 0; i < mergedEntities.length; i++) {
            for (let j = 0; j < mergedEntities.length; j++) {
                if (i == j) {
                    continue;
                }
                if (mergedEntities[i].id == mergedEntities[j].id) {
                    // removes the same entity, but adds the size to the original
                    if (mergedEntities[j].x < mergedEntities[i].x) {
                        mergedEntities[i].x = mergedEntities[j].x;
                        mergedEntities[i].w += mergedEntities[j].w;
                    }
                    if (mergedEntities[j].y < mergedEntities[i].y) {
                        mergedEntities[i].y = mergedEntities[j].y;
                        mergedEntities[i].h += mergedEntities[j].h;
                    }
                    if (mergedEntities[j].x > mergedEntities[i].x) {
                        mergedEntities[i].w += mergedEntities[j].w;
                    }
                    if (mergedEntities[j].y > mergedEntities[i].y) {
                        mergedEntities[i].h += mergedEntities[j].h;
                    }
                    mergedEntities.splice(j, 1);
                    j--;
                }
            }
        }
        return entities.concat(mergedEntities);
    }
    render() {
        for (let i = 0; i < this.levelW; i++) {
            for (let j = 0; j < this.levelH; j++) {
                //renders the floor
                c.drawImage(
                    SHEET,
                    1 * meta.tileSize,
                    1 * meta.tileSize,
                    meta.tileSize,
                    meta.tileSize,
                    ((i + this.x) * meta.tileSize * meta.ratio) | 0,
                    ((j + this.y) * meta.tileSize * meta.ratio) | 0,
                    meta.tileSize * meta.ratio,
                    meta.tileSize * meta.ratio
                );
            }
        }
    }
    /**
     * @param dir Direction of the map movement, expressed in [ changeX, changeY ]
     */
    changeLevel(dir) {
        //clears the vfxs
        vfxsManager.removeAll();
        // Remove the player from previous level
        this.entities.splice(this.entities.indexOf(player), 1)



        // changes the current level
        this.currentLevel = [
            this.currentLevel[0] + dir[0],
            this.currentLevel[1] + dir[1],
        ];

        for (let portal of this.map[this.currentLevel[0]][this.currentLevel[1]].portals) {
            /* If the portal matches the opposite of the entered portal, 
            teleport the player here. 
            Example: if portal taken goes to "left" (-1, 0)
            then take the one that goes to "right" (1 , 0)
            */
            if (portal.dir[0] == dir[0] * -1 && portal.dir[1] == dir[1] * -1) {
                console.log(portal.dir)
                // Move the player to the target portal but out of it to avoid teleporting back
                player.x = -player.w / 2 + portal.x + portal.w / 2 - (player.w * portal.dir[0]);
                player.y = -player.h / 2 + portal.y + portal.h / 2 - (player.h * portal.dir[1]);
            }
        }
        // Replaces the entities with the changed level entities
        this.entities = this.map[this.currentLevel[0]][this.currentLevel[1]].entities;

        // Pushes the removed player into the next room
        this.entities.push(player);

        // Reveals the level, since the player just entered it
        this.map[this.currentLevel[0]][this.currentLevel[1]].revealed = true;
    }
    renderMinimap() {
        let size = 15;
        let room;
        c.save();
        c.translate(canvas.width - this.w * size, canvas.height - this.h * size);
        c.globalAlpha = 0.2;
        c.fillStyle = "#a3a7c2";
        c.fillRect(0, 0, this.w * size, this.h * size);
        c.globalAlpha = 1;
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                room = this.map[i][j];
                if (room == 0) {
                    continue;
                }
                if (!room.revealed) {
                    continue;
                }
                // Draws rooms
                switch (this.map[i][j].type) {
                    case 0:
                        c.fillStyle = "#14182e";
                        break;
                    case 1:
                        c.fillStyle = "#686f99";
                        break;
                    case 2:
                        c.fillStyle = "#f0b541";
                        break;
                    case 3:
                        c.fillStyle = "#ad2f45";
                        break;
                }
                c.fillRect(
                    i * size + size / 10,
                    j * size + size / 10,
                    size - size / 5,
                    size - size / 5
                );
                // Draws links
                for (let link of room.links) {
                    c.fillStyle = "#f5ffe8";
                    c.fillRect(
                        (i + link[0] / 2) * size + size / 2 - size / 10,
                        (j + link[1] / 2) * size + size / 2 - size / 10,
                        size / 5,
                        size / 5
                    );
                }

                if (this.currentLevel[0] === i && this.currentLevel[1] === j) {
                    c.globalAlpha = 0.8;
                    c.fillStyle = "#ffee83";
                    c.fillRect(
                        i * size + size / 3,
                        j * size + size / 3,
                        size - size / 1.5,
                        size - size / 1.5
                    );
                }
            }
        }
        c.globalAlpha = 1;
        c.restore();
    }
    checkCollisions(obj, returnColliders, simpleCol) {
        let col = "none";
        obj.col.L = 0;
        obj.col.R = 0;
        obj.col.T = 0;
        obj.col.B = 0;
        let collidersChunk = [];
        for (let entity of this.entities) {
            //isOutOfScreen(entity) || entity.notSolid
            if (entity.notSolid) {
                continue;
            }
            if (entity.removed) {
                continue;
            }
            if (obj === entity) {
                continue;
            }
            if (collided(obj, entity)) {
                //adds item to colliders array
                if (simpleCol) {
                    col = colCheck(obj, entity);
                } else {
                    collidersChunk.push(entity);
                }
            }
        }

        if (collidersChunk.length > 1) {
            collidersChunk = assembleChunk(collidersChunk, obj);
        }
        for (let i = 0; i < collidersChunk.length; i++) {
            col = colCheck(obj, collidersChunk[i]);
        }

        if (obj.col.R - obj.col.L !== 0) {
            obj.x -= obj.col.R - obj.col.L;
        }
        if (obj.col.B - obj.col.T !== 0) {
            obj.y -= obj.col.B - obj.col.T;
        }
        if (returnColliders) {
            return collidersChunk;
        }
    }
    sortEntities() {
        this.entities.sort(function(a, b) {
            if (b.type == "bg") {
                return 0;
            }
            return (a.y + a.h) - (b.y + b.h);
        })
    }
    computeEntities() {
        for (let entity of this.entities) {
            if (entity.removed) {
                continue;
            }
            entity.compute();
        }
    }
    renderEntities() {
        for (let entity of this.entities) {
            if (entity.removed) {
                continue;
            }
            entity.render();
        }
    }
    renderShadows() {
        c.globalAlpha = 0.5;
        for (let entity of this.entities) {
            if (entity.removed || !entity.shadow) {
                continue;
            }
            entity.renderShadow();
        }
        c.globalAlpha = 1;
    }
}

export const map = new MapObject();
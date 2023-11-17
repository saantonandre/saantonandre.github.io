// COLLISION DETECTORS

function isOutOfScreen(entity) {
    if (entity == null) {
        return true;
    }
    if (entity.x > map.tilesWidth - map.x) {
        return true;
    }
    if (entity.x + entity.w < -map.x) {
        return true;
    }
    if (entity.y > map.tilesHeight - map.y + 1) {
        return true;
    }
    if (entity.y + entity.h < -map.y) {
        return true;
    }
    return false;
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var shapeAA, shapeBB;
    if (shapeA.hitbox != null) {
        shapeAA = shapeA.hitbox;
    } else {
        shapeAA = shapeA;
    }
    if (shapeB.hitbox != null) {
        shapeBB = shapeB.hitbox;
    } else {
        shapeBB = shapeB;
    }
    var vX = (shapeAA.x + (shapeAA.w / 2)) - (shapeBB.x + (shapeBB.w / 2)),
        vY = (shapeAA.y + (shapeAA.h / 2)) - (shapeBB.y + (shapeBB.h / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeAA.w / 2) + (shapeBB.w / 2),
        hHeights = (shapeAA.h / 2) + (shapeBB.h / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        let tolerance = 0.0;
        if (oX >= oY) {
            if (Math.abs(vY) > tolerance) {
                if (vY > 0) {
                    colDir = "t";
                    if (shapeA.col.T < oY && !shapeB.xVel) {
                        shapeA.col.T += oY;
                    }
                } else {
                    colDir = "b";
                    if (shapeA.col.B < oY) {
                        shapeA.col.B = oY;
                    }
                    if (shapeB.xVel) {
                        shapeA.xVelExt = shapeB.xVel;
                    }
                    if (shapeB.xVel) {
                        if (shapeB.yVel < 0) {
                            shapeA.yVelExt = shapeB.yVel;
                        }
                        if (shapeB.yVel > 0) {
                            shapeA.yVelExt = shapeB.yVel;
                        }
                    }
                }
            }
        } else {
            if (Math.abs(vX) > tolerance) {
                if (vX > 0) {
                    colDir = "l";
                    if (shapeA.col.L < oX) {
                        if (oX > 0.01)
                            shapeA.col.L += oX;
                    }
                } else {
                    colDir = "r";
                    if (shapeA.col.R < oX) {
                        if (oX > 0.01)
                            shapeA.col.R += oX;
                    }
                }

            }
        }

    }

    return colDir;

}

function collided(a, b) {
    var square1 = a.hitbox ? a.hitbox : a;
    var square2 = b.hitbox ? b.hitbox : b;
    if (square1.x < square2.x + square2.w) {
        if (square1.x + square1.w > square2.x) {
            if (square1.y < square2.y + square2.h) {
                if (square1.y + square1.h > square2.y) {
                    return true;
                }
            }
        }
    }
    return false;
}

function pointSquareCol(point, sq) {
    var square = sq;
    if (sq.hitbox !== undefined) {
        square = sq.hitbox;
    }
    if (point.x > square.x) {
        if (point.x < square.x + square.w) {
            if (point.y > square.y) {
                if (point.y < square.y + square.h) {
                    return true;
                }
            }

        }
    }
    return false;
}

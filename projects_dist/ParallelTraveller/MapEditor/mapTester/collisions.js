
function id(arg) {
    return document.getElementById(arg);
}

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
        if (oX >= oY) {
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
        } else {
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

function lineSquareCol(line, sq) {
    let squareLines = getRectSides(sq);
    for (let i = 0; i < squareLines.length; i++) {
        if (intersect(
                squareLines[i].x1,
                squareLines[i].y1,
                squareLines[i].x2,
                squareLines[i].y2,
                line.x1,
                line.y1,
                line.x2,
                line.y2,
            )) {
            return true;
        }
    }

    return false;
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return {
        x,
        y
    }
}

function returnCosine(x1, y1, x2, y2) {
    let cosine = {
        cos: 0,
        sin: 0
    };
    let deltaX = x1 - x2;
    let deltaY = y1 - y2;
    let rotation = Math.atan2(deltaY, deltaX);
    cosine.cos = Math.cos(rotation);
    cosine.sin = Math.sin(rotation);
    return cosine;
}

function getRectSides(rect) {
    let sides = [];
    let sq = rect;
    if (rect.hitbox !== undefined) {
        sq = rect.hitbox;
    }
    sides.push({
        x1: sq.x,
        y1: sq.y,
        x2: sq.x + sq.w,
        y2: sq.y
    })
    sides.push({
        x1: sq.x + sq.w,
        y1: sq.y,
        x2: sq.x + sq.w,
        y2: sq.y + sq.h
    })
    sides.push({
        x1: sq.x + sq.w,
        y1: sq.y + sq.h,
        x2: sq.x,
        y2: sq.y + sq.h
    })
    sides.push({
        x1: sq.x,
        y1: sq.y + sq.h,
        x2: sq.x,
        y2: sq.y
    })


    return sides;
}

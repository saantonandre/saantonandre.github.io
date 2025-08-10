export var tiles = [
    [1, 1], // 0 - tile
    [0, 0],
    [1, 0],
    [2, 0], // 1 - 2 - 3 upper walls
    [0, 1],
    [2, 1], // 4 - 5 side walls
    [0, 2],
    [1, 2],
    [2, 2], // 6 - 7 - 8 down walls
    [3, 0],
    [4, 0], // 9 - 10 right/left breaks (up)
    [3, 1],
    [4, 1], // 11 - 12  right/left breaks (down)
    [3, 2],
    [3, 3], // 13 - 14  up/down breaks (left)
    [4, 2],
    [4, 3], // 15 - 16  up/down breaks (right)
    [5, 0],
    [6, 0],
    [7, 0], // 17 - 18 - 19 holes UP
    [5, 1],
    [6, 1],
    [7, 1], // 20 - 21 - 22 holes MID
    [5, 2],
    [6, 2],
    [7, 2], // 23 - 24 - 25 holes DOWN
    [5, 3],
    [6, 3],
    [7, 3], // 26 - 27 - 28 holes HOR
    [8, 0],
    [8, 1],
    [8, 2], // 29 - 30 - 31 holes VER
    [8, 3], // 32 holes SINGLE
];
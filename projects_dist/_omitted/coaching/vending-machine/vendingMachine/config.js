const config = (() => {
  const PADDING_X = 20;
  const PADDING_Y = 50;
  const ITEM_WIDTH = 100;
  const ITEM_HEIGHT = 125;
  const MATRIX_COLS = 4;
  const MATRIX_ROWS = 3;
  const WIDTH = MATRIX_COLS * ITEM_WIDTH + PADDING_X * MATRIX_COLS - 2;
  const HEIGHT = MATRIX_ROWS * ITEM_HEIGHT + PADDING_Y * MATRIX_ROWS - 2;
  return {
    PADDING_X,
    PADDING_Y,
    ITEM_WIDTH,
    ITEM_HEIGHT,
    MATRIX_COLS,
    MATRIX_ROWS,
    WIDTH,
    HEIGHT,
  };
})();

export default config;

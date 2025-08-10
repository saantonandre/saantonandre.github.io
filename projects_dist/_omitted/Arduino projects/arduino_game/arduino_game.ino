
#include <SD.h>
#include <TFT.h>  // Docs: https://github.com/arduino-libraries/TFT/blob/master/docs/api.md
#include "controls.h"

TFT ctx = TFT(10, 9, 8);

const int ws = ctx.width();
const int hs = ctx.height();

struct Entity {
  int x = 0;
  int y = 0;
  int s = 10;
  int px = 0;
  int py = 0;
};

void render (Entity* e) {
  ctx.noStroke();
  ctx.fill(0, 0, 255);
  ctx.rect(e->x, e->y, e->s, e->s);
  e->px = e->x;
  e->py = e->y;
}
void clearEnt (Entity e) {
  if (e.x == e.px && e.y == e.py) {
    return;
  }
  ctx.noStroke();
  ctx.fill(0, 0, 0);
  ctx.rect(e.px, e.py, e.s, e.s);
}
struct Entity player;

void setup() {
  ctx.begin();
  ctx.background(0, 0, 0);
}

void gui() {
  if (player.x == player.px && player.y == player.py) {
    return;
  }
  ctx.fill(0, 0, 0);
  ctx.rect(0, 0, ws / 2, 20);
  char txt[9];      // some suitable size
  sprintf(txt, "%d %d", player.x, player.y);
  ctx.stroke(0, 0, 255);
  ctx.text(txt, 5, 0);
}

void loop() {
  int x = ((1022 - joy_y()) / 1022.0) * ws;
  int y = ((joy_x()) / 1022.0) * hs * 0.8 + hs * 0.2 / 2;
  player.x = x - player.s / 2;
  player.y = y - player.s / 2;
  clearEnt(player);
  ctx.fill(0, 0, 255);
  gui();
  render(&player);
  delay(30);
}

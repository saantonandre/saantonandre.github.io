#define BLUE 3
#include "test.h"
void setup() {
  // pinMode(RED, OUTPUT);
  // pinMode(GREEN, OUTPUT);
   pinMode(BLUE, OUTPUT);
  // digitalWrite(RED,LOW);
  // digitalWrite(GREEN,LOW);
  analogWrite(BLUE,0);
}
boolean on = false;
void loop() {
    hello();
    delay(500);
    analogWrite(BLUE,LOW);
    delay(500);
}

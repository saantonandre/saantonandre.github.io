
const int X_pin = A0; // analog pin connected to X output
const int Y_pin = A1; // analog pin connected to Y output

int joy_x(){
  return analogRead(X_pin);
}
int joy_y(){
  return analogRead(Y_pin);
}

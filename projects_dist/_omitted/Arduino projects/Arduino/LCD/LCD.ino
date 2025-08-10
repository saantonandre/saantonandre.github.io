// include the library code:
#include <LiquidCrystal.h>
// initialize the library with the numbers of the interface pins
LiquidCrystal lcd(7, 8, 9, 10, 11, 12);

const int buttonPin = 13;
const int ledPin = 5;

void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print("Hello, World!");
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void handleButton(){
  if(digitalRead(buttonPin) == LOW){
    digitalWrite(ledPin,HIGH);    
    lcd.setCursor(0, 1);
    lcd.print("                ");
  }else{
    digitalWrite(ledPin,LOW);
    lcd.print("PICCADILLY");
  }
}
void loop() {
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  lcd.setCursor(0, 1);
  // print the number of seconds since reset:
  
  handleButton();
}

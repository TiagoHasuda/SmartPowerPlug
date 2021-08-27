#include <Arduino.h>
#include <ESP8266WiFi.h>
#include "fauxmoESP.h"
#include "ESPAsyncTCP.h"
#include "ESPAsyncWebServer.h"

#define WIFI_SSID "YOUR SSID"
#define WIFI_PASS "YOUR PASS"

#define RELAY_PIN 2
#define TOUCH_PIN 0
#define TX_PIN 1

#define LIGHT_1 "Light"

fauxmoESP fauxmo;

AsyncWebServer server2(90);

int touch_value = 0;
bool touch_clicked = false;
bool relay_on = false;

void switchRelay() {
  relay_on = !relay_on;
  if (!relay_on)
    digitalWrite(RELAY_PIN, HIGH);
  else
    digitalWrite(RELAY_PIN, LOW);
}

void handleFauxmoSetState (unsigned char device_id, const char * device_name, bool state, unsigned char value) {
  if ( strcmp(device_name, LIGHT_1) == 0) {
    relay_on = state;
    if (!relay_on)
      digitalWrite(RELAY_PIN, HIGH);
    else
      digitalWrite(RELAY_PIN, LOW);
  }
}

void handleRootPath(AsyncWebServerRequest *request) {
  request->send(200, "application/json", relay_on ? "true" : "false");
}

void handleSwitch(AsyncWebServerRequest *request) {
  switchRelay();
  request->send(200, "application/json", "true");
}

void handleTurnOn(AsyncWebServerRequest * request) {
  if (!relay_on) {
    relay_on = true;
    digitalWrite(RELAY_PIN, LOW);
  }
  request->send(200, "application/json", "true");
}

void handleTurnOff(AsyncWebServerRequest * request) {
  if (relay_on) {
    relay_on = false;
    digitalWrite(RELAY_PIN, HIGH);
  }
  request->send(200, "application/json", "true");
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(TOUCH_PIN, INPUT);
  pinMode(TX_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(TX_PIN, LOW);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
  }

  fauxmo.createServer(true);
  fauxmo.setPort(80);
  fauxmo.enable(true);
  fauxmo.addDevice(LIGHT_1);
  fauxmo.onSetState(handleFauxmoSetState);

  server2.on("/", HTTP_GET, handleRootPath);
  server2.on("/switch", HTTP_POST, handleSwitch);
  server2.on("/turnOn", HTTP_POST, handleTurnOn);
  server2.on("/turnOff", HTTP_POST, handleTurnOff);
  server2.begin();
}

void loop() {
  fauxmo.handle();

  touch_value = digitalRead(TOUCH_PIN);
  if (touch_value == HIGH) {
    if (!touch_clicked) {
      touch_clicked = true;
      switchRelay();
      delay(100);
    }
  } else {
    touch_clicked = false;
  }
}

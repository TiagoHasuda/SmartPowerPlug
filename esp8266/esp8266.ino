/*
   Copyright (c) 2015, Majenko Technologies
   All rights reserved.

   Redistribution and use in source and binary forms, with or without modification,
   are permitted provided that the following conditions are met:

 * * Redistributions of source code must retain the above copyright notice, this
     list of conditions and the following disclaimer.

 * * Redistributions in binary form must reproduce the above copyright notice, this
     list of conditions and the following disclaimer in the documentation and/or
     other materials provided with the distribution.

 * * Neither the name of Majenko Technologies nor the names of its
     contributors may be used to endorse or promote products derived from
     this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
   ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

#ifndef STASSID
#define STASSID "SSID"
#define STAPSK  "PASSWORD"
#endif

const char *ssid = STASSID;
const char *password = STAPSK;

ESP8266WebServer server(80);

const int relay_pin = 2;
const int touch_pin = 0;
const int tx_pin = 1;
int touch_value = 0;
bool touch_clicked = false;

bool relay_on = false;

void switchRelay() {
  relay_on = !relay_on;
  if (relay_on)
    digitalWrite(relay_pin, HIGH);
  else
    digitalWrite(relay_pin, LOW);
}

void handleRoot() {
  server.send(200, "text/html", ":)");
}

void handleSwitch() {
  switchRelay();
  server.send(200, "application/json", String(relay_on));
}

void handleTurnOn() {
  if (!relay_on) {
    relay_on = true;
    digitalWrite(relay_pin, HIGH);
  }
  server.send(200, "application/json", "true");
}

void handleTurnOff() {
  if (relay_on) {
    relay_on = false;
    digitalWrite(relay_pin, LOW);
  }
  server.send(200, "application/json", "true");
}

void handleNotFound() {
  digitalWrite(relay_pin, 1);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";

  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }

  server.send(404, "text/plain", message);
  digitalWrite(relay_pin, 0);
}

void setup(void) {
  pinMode(relay_pin, OUTPUT);
  pinMode(touch_pin, INPUT);
  pinMode(tx_pin, OUTPUT);
  digitalWrite(relay_pin, LOW);
  digitalWrite(tx_pin, LOW);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  server.on("/", handleRoot);
  server.on("/switch", handleSwitch);
  server.on("/turnOn", handleTurnOn);
  server.on("/turnOff", handleTurnOff);
  server.onNotFound(handleNotFound);
  server.begin();
}

void loop(void) {
  server.handleClient();
  MDNS.update();

  touch_value = digitalRead(touch_pin);

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

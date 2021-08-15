# Notizen

* Tutorial? (evtl. erst später entscheiden, ob wir noch Lust und Zeit haben) 
  * optionale Erweiterung
* Mobile-Version? (Ist kein Muss) 
  * GUI-Draft für Mobile
* Was wird persistiert und wie persistieren wir? 
  * Scoreboard und Spieler Authentifizierung
* Gibt es Zuschauer? 
  * Nein
* Gibt es ein Spiel oder können mehrere Spiele parallel stattfinden? 
  * erstmals nur ein Spiel, optionale Erweiterung
* Kann man mit anonymen Spielern spielen (Lobby/Zufällig) oder nur per Einladung? 
  * zu Beginn nicht relevant
* Was passiert, wenn man das Browsertab neu lädt / den Browser neu startet oder Verbindungsprobleme hat?
  * Soll weiterhin eingeloggt sein (z.B. durch UUID vom Server, die beim Client im Session Storage gespeichert wird)
* Was ist, wenn ich mit demselben Browser, aber mehrere Tabs das Spiel öffne/spiele? 
  * Muss in zwei unterschiedlichen Browser auf dem selben Gerät funktionieren.
* Mit wem kann ich chatten? (Broadcast an alle oder auch an einzelne Personen oder Lobby-Chat?) 
  * fürs erste nur Broadcasten
* Was passiert, wenn während dem Spiel ein Spieler aussteigt (freiwillig oder unfreiwillig)? Was ist, wenn ein Spieler nicht reagiert, wenn er am Zug ist? 
  * Timer, wenn dieser abgelaufen wird eine Karte gezogen und eine zufällige Karte abgeworfen
* Kann ein Spiel abgebrochen werden? 
  * Ja, wenn alle Spieler einverstanden sind.

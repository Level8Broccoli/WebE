# Projekttagebuch

Letzte Sitzung zu oberst einfügen.

Folgende Anforderungen sind an das Projekttagebuch gestellt:

> Neben der Dokumentation des Spiels soll auch ein Projekttagebuchgeführt werden. In diesem
> soll Protokoll über den Verlauf des Projektes geführt werden. Erwartete Inhalte:
>
> - Protokoll der Sitzungen
> - Beschreibung der kurzfristigen Ziele und wie diese Ziele erreicht werden sollen
> - Protokollierung der gefällten Entscheidungen
> - Aufgabenverteilung
> - Regelmässige Projektüberwachung (d.h. wird der ursprüngliche Arbeitsplan eingehalten,
>   wo gibt es Verzögerungen, welche Korrekturmassnahmen wurde ergriffen, etc.)
> - Sind Probleme im Lauf des Projekts aufgetreten? Falls ja, welche?
> - Auch zum Projekttagebuch werden keine Vorgaben zur Umsetzung gemacht. Dies kann
>   ebenfalls innerhalb der Gruppe festgelegt werden.

## Sitzung 15.08.2021

- Spiel ausgewählt -> Level 8
- Techstack finalisiert -> MEVN (Mongo DB, Express.js, Vue.js, Node.js)
- Fragen geklärt

  - Gibt es Vorgaben bezüglich Sprache etc.? _Nein, man darf beliebige Technologie wählen. Es muss lediglich im Browser laufen schlussendlich._
  - Was bedeutet die Anforderung 3 Levels? _Verschiedene Schwierigkeiten, unterschiedlicher Funktionsumfang/Modi_
  - Muss es auf einem Handy laufen? _Nein, aber verschiedene Displaygrössen unterstützen._
  - Was sind Datensammler-Games? _Games, die spielerisch den Spielern Daten entnehmen._

- Zusätzliche Frage besprochen:

  - Tutorial für Spieler? (evtl. erst später entscheiden, ob wir noch Lust und Zeit haben) _optionale Erweiterung_
  - Mobile-Version? (Ist kein Muss) _Zuerst ein GUI-Draft für Mobile erstellen_

  - Was wird persistiert und wie persistieren wir? _Scoreboard und eventuell Spieler Authentifizierung_

  - Gibt es Zuschauer? _Nein_

  - Gibt es ein Spiel oder können mehrere Spiele parallel stattfinden? _erstmals nur ein Spiel, optionale Erweiterung um Lobby System_

  - Kann man mit anonymen Spielern spielen (Lobby/Zufällig) oder nur per Einladung? _zu Beginn nicht relevant_

  - Was passiert, wenn man das Browsertab neu lädt / den Browser neu startet oder Verbindungsprobleme hat? _Soll weiterhin eingeloggt sein (z.B. durch UUID vom Server, die beim Client im Session Storage gespeichert wird)_

  - Was ist, wenn ich mit demselben Browser, aber mehrere Tabs das Spiel öffne/spiele? _Muss in zwei unterschiedlichen Browser auf dem selben Gerät funktionieren._

  - Mit wem kann ich chatten? (Broadcast an alle oder auch an einzelne Personen oder Lobby-Chat?) _fürs erste nur Broadcasten_

  - Was passiert, wenn während dem Spiel ein Spieler aussteigt (freiwillig oder unfreiwillig)? Was ist, wenn ein Spieler nicht reagiert, wenn er am Zug ist? _Timer, wenn dieser abgelaufen wird eine Karte gezogen und eine zufällige Karte abgeworfen_

  - Kann ein Spiel abgebrochen werden? _Ja, wenn alle Spieler einverstanden sind._

- Nächste Schritte:

  - Oliver: Aufsetzen der Entwicklungsumgebung und automatischen Deploymentpipeline
  - Thierry: Start mit Dokumentation von Meilenstein 1

- Bisherige Probleme / Verzögerungen: _Keine_

## Sitzung 13.08.2021

- Erstes Kennenlernen der Projektteilnehmer
  - Kenntnisse geklärt
- Persönliche Ziele notiert
  - Neue Technologien ausprobieren wie z.B. automatisches Deployment
  - Typescript für Backend mit Node.js
  - Docker für gemeinsamer Workspace
- Brainstorming für Spielideen u.a.
  - Pong
  - Uno
  - Level 8
  - ...
- Fragen notiert

  - Gibt es Vorgaben bezüglich Sprache etc.?
  - Was bedeutet die Anforderung 3 Levels?
  - Muss es auf einem Handy laufen?
  - Was sind Datensammler-Games?

- Nächste Schritte:

  - Oliver: Fragen in PVA klären und danach Thierry informieren
  - Thierry: keine, da abwesend an PVA 1

- Bisherige Probleme / Verzögerungen: _Keine_

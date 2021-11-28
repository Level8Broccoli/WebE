[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Nächste Seite](randbedingungen.md)

# Einführung und Ziele

Dieser Abschnitt führt in die Aufgabenstellung ein und skizziert die Ziele, die wir in diesem Projekt verfolgen.

## Aufgabenstellung

Die Aufgabenstellung der Schule fordert eine Spezifikation, Umsetzung und Dokumentation eines verteilten Mehrbenutzer-Spiels mit modernen Web-Technologien. Es ist dabei freigestellt, mit welchen Technologiestacks man arbeiten möchte.

Folgende Anforderungen müssen seitens Studenten eingehalten werden:

1. Entwicklung eins Spiels mittels Web-Technologien vom folgenden Typ:
   - Runden-basiert
   - Educational
   - Datensammler
2. Das Spiel muss eine Client/Server Architektur haben
3. Der Server und die Clients kommunizieren über ein Text-basiertes Protokoll. Das Protokoll muss lesbar sein.
4. Die Server-Funktionalität ist wie folgt definiert:
   - Er verwaltet den Spielverlauf (überprüft und stellt sicher, dass alle Spielzüge regelkonform sind, erkennt das Ende des Spiels, zählt Punkte, etc.)
   - Wenn alle Spieler das Spiel verlassen, dann beendet der Server das Spiel.
5. Ein Client hat folgende Eigenschaften:
   - Er nimmt Benutzereingaben durch eine grafische Schnittstelle (graphical userinterface, GUI) entgegen
   - Er gleicht den lokalen Status eines Spiels mit dem Status des Servers ab (Synchronisation)
   - Er erlaubt den Spielern eines Spiels zu chatten.
6. Folgende Aspekte sollen beachtet werden: Internationalisierung, Usability, Accessability, Levels (das Spiel muss mind. 3 Levels haben), Responsiveness
7. Am Ende des Projekts muss eine komplette Distribution des Spiels abgegeben werden (lauffähiges Spiel inklusive Quellcode, Installationsanleitung, Handbuch)

## Meilensteine

Während des Projekts sollen von allen Teams vordefinierte "Meilensteine” zu einem bestimmten Zeitpunkt erfüllt werden. Mit den Meilensteinen wird der Projektfortschritt überprüft.

### Meilenstein 1

Erwartet wird ein Bericht mit folgenden Aspekten. Die Art der Protokollierung ist den Gruppen überlassen.

- Beschreibung des Ziels des Spieles und der zugehörigen Spielregeln.
- Beschreibung der Anforderungen (Funktional, Nicht-Funktional, KANN, MUSS).
- Präsentation der Anforderungen an die zu entwickelnde Software
- Kurze Beschreibung des Protokolls zwischen Client und Server

### Meilenstein 2

Erwartet wird ein Bericht mit folgenden Aspekten:

- Spezifikation des Netzwerkprotokolls - erster Entwurf.
- Erster Entwurf Server.
- Erster Entwurf GUI.
- Die Anmeldung Client beim Server vollständig realisiert (GUI muss nicht vollständig realisiert sein).
- Senden einer Nachricht von einem Client zu einem anderen Client vollständig realisiert.

### Meilenstein 3

Erwartet wird ein Bericht mit folgenden Aspekten:

- Verwaltung Status des Spiels.
- Komplette Implementierung des Protokolls.
- Das Spiel muss vollständig realisiert sein (ohne vollständiges GUI und Regelüberprüfung).
- Zweiter Entwurf Server.
- Zweiter Entwurf GUI.
- In der Beschreibung soll klar beschrieben sein, was im zweiten Entwurf vom GUI und Server dazu kam.

### Meilenstein 4

Erwartet wird ein Bericht mit folgenden Aspekten:

- Definitive Version Server
- Definitive Version GUI
- In der Beschreibung soll klar beschrieben sein, was in der definitiven Version vom GUI und Server dazu kam.
- Validity Check (Überprüfung der Spielregeln)

### Meilenstein 5

Ziel dieses Meilensteins ist die Präsentation des gesamten Projekts (30’ min pro Gruppe) im Plenum. Dazu gehört eine Zusammenfassung des gesamten Projektablaufes und eine Live-Demonstration des Spiels. Folgende Aspekte soll die Präsentation beinhalten:

1. Die Spielregeln
2. Die Architektur des Spiels
3. Die verwendeten Technologien
4. Die interessantesten Code Beispiele
5. Das methodische Vorgehen
6. Die Erkenntnisse

## Stakeholder

Die folgende Tabelle stellt die Stakeholder von unserem Projekt und ihre jeweilige Intention dar.

| Wer?                  | Interesse, Bezug                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzer / Spieler    | Kennt das Spiel möglicherweise nicht. Will mit seinen Freunden / seiner Familie eine Runde spielen. Beliebiges Alter und technische Versiertheit. |
| Heinrich Zimmermann   | Dozent und stellt die Aufgabe.                                                                                                                    |
| Wir (Oliver, Thierry) | Projekt erfolgreich abschliessen. Neue Technologie anwenden. Projekt kann auf Github als Demo publiziert werden.                                  |

[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Nächste Seite](randbedingungen.md)

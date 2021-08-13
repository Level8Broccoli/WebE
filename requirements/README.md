# Requirements (Auszug)

## Anforderungen

1.  Entwicklung eins Spiels mittels Web-Technologien vom folgenden Typ
    a.  Runden-basiert, oder
    b.  Educational oder
    c.  Datensammler
2.  Das Spiel muss eine Client/Server Architektur haben
3.  Der Server und die Clients kommunizieren über ein Text-basiertes Protokoll. Das Protokoll muss lesbar sein.
4.  Die Server-Funktionalität ist wie folgt definiert:
    a.  Er verwaltet den Spielverlauf (überprüft und stellt sicher, dass alle Spielzüge
    regelkonform sind, erkennt das Ende des Spiels, zählt Punkte, etc.)
    b.  Wenn alles Spieler das Spiel verlassen, dann beendet der Server das Spiel.
5.  Ein Client hat folgende Eigenschaften:
    a.  Er nimmt Benutzereingaben durch eine grafische Schnittstelle (graphical userinterface, GUI) entgegen
    b.  Er gleicht den lokalen Status eines Spiels mit dem Status des Servers ab (Synchronisation)
    c.  Er erlaubt den Spielern eines Spiels zu chatten.
6.  Folgende Aspekte sollen beachtet werden: Internationalisierung, Usability, Accessability, Levels (das Spiel muss mind. 3 Levels haben), Responsiveness
7.  Am Ende des Projekts muss eine komplette Distribution des Spiels abgegeben werden (lauffähiges Spiel inklusive Quellcode, Installationsanleitung, Handbuch)

## Meilensteine

Während des Projekts sollen von allen Teams vordefinierte "Meilensteine" zu einem bestimmten Zeitpunkt erfüllt werden. Mit den Meilensteinen wird der Projektfortschritt überprüft.

### 1.1  Meilenstein1

Erwartet wird ein Bericht mit folgenden Aspekten. Die Art der Protokollierung ist den Gruppen überlassen.

*  Beschreibung des Ziels des Spieles und der zugehörigen Spielregeln.
*  Beschreibung der Anforderungen (Funktional, Nicht-Funktional, KANN, MUSS).
*  Präsentation der Anforderungen an die zu entwickelnde Software
*  Kurze Beschreibung des Protokolls zwischen Client und Server

### 2.1  Meilenstein2

Erwartet wird ein Bericht mit folgenden Aspekten

*  Spezifikation des Netzwerkprotokolls  - erster Entwurf.
*  Erster Entwurf Server.
*  Erster Entwurf GUI.
*  Die Anmeldung Client beim Server vollständig realisiert (GUI muss nicht vollständig realisiert sein).
*  Senden einer Nachricht von einem Client zu einem anderen Client vollständig realisiert.

### 3.1  Meilenstein3

Erwartet wird ein Bericht mit folgenden Aspekten

*  Verwaltung Status des Spiels.
*  Komplette Implementierung des Protokolls.
*  Das Spiel muss vollständig realisiert sein (ohne vollständiges GUI und Regelüberprüfung).
*  Zweiter Entwurf Server.
*  Zweiter Entwurf GUI.
*  In der Beschreibung soll klar beschrieben sein, was im zweiten Entwurf vom GUI und Server dazu kam.

### 4.1  Meilenstein4

Erwartet wird ein Bericht mit folgenden Aspekten

*  Definitive Version Server
*  Definitive Version GUI
*  In der Beschreibung soll klar beschrieben sein, was in der definitiven Version vom GUI und Server dazu kam.
*  Validity Check (Überprüfung der Spielregeln)

### 5.1  Meilenstein5

Ziel dieses Meilensteins ist die Präsentation des gesamten Projekts (30’ min pro Gruppe) im Plenum. Dazu gehört eine Zusammenfassung des gesamten Projektablaufes und eine Live-Demonstration des Spiels. Folgende Aspekte soll die Präsentation beinhalten

1. Die Spielregeln
2. Die Architektur des Spiels
3. Die verwendeten Technologien
4. Die interessantesten Code Beispiele
5. Das methodische Vorgehen
6. Die Erkenntnisse

## Abgaben an den Meilensteinterminen

Ein Meilenstein besteht aus (Ausnahme: Meilenstein 1)

*  Aussagekräftige Dokumentation des Quelltextes; die Art der Dokumentation ist den Gruppen selbst überlassen (z.B. privates Wiki, Textdokument, etc.)
*  Projekttagebuch; die Art der Protokollierung ist den Gruppen selbst überlassen (z.B. Blog, Textdokument, etc.). Es wird lediglich verlangt, dass die Art der Protokollierung beim ersten Meilenstein bereits angegeben wird.
*  Zusammenfassung aller Inhalte des Projekt-Meilensteins: IST / SOLL
*  den gesamten -Quelldateien des Projekts
*  Der Zwischenstand des Projekts muss rechtzeitig vor den Meilensteinen in das git-Repository des eingecheckt werden (Abgaben per Email werden nicht akzeptiert).

## Projektdokumentation

Die Dokumentation sollte klar, komplett und nachvollziehbar sein.

In der Projektdokumentation muss enthalten sein

*  die verwendeten Bibliotheken (Libraries)
*  Beschreibung der Funktionalität des Spiels (auch: wo sind die Grenzen)
*  Struktur des Programms
*  Anleitung zum Start und zur Bedienung des Client-Server-Programms
*  Beispielsession (eine beispielhafte Interaktion mehrerer Spieler mit dem System)
*  Software-Qualitätsmanagement (Testing)
*
Neben der Dokumentation des Spiels soll auch ein Projekttagebuchgeführt werden. In diesem soll Protokoll über den Verlauf des Projektes geführt werden. Erwartete Inhalte

*  Protokoll der Sitzungen
*  Beschreibung der kurzfristigen Ziele und wie diese Ziele erreicht werden sollen
*  Protokollierung der gefällten Entscheidungen
*  Aufgabenverteilung
*  Regelmässige Projektüberwachung (d.h. wird der ursprüngliche Arbeitsplan eingehalten, wo gibt es Verzögerungen, welche Korrekturmassnahmen wurde ergriffen, etc.)
*  Sind Probleme im Lauf des Projekts aufgetreten? Falls ja, welche?
*  Auch zum Projekttagebuch werden keine Vorgaben zur Umsetzung gemacht. Dies kann ebenfalls innerhalb der Gruppe festgelegt werden.

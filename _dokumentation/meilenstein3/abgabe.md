# Meilenstein 3

Guten Tag Herr Zimmermann

Hier finden Sie unsere Abgabe zum Meilenstein 3 (WebE):

- Release: https://github.com/Level8Broccoli/WebE/releases/tag/Milestone3
- Kanban Board: https://github.com/Level8Broccoli/WebE/projects/1
- Das Spiel kann bereits unter folgender URL ausprobiert werden: https://game.lvl8.io/

## Release notes

Bereiten Sie den 3. Meilenstein gemäss der nachfolgender Beschreibung vor.

- Verwaltung Status des Spiels.
  - TBD
- Komplette Implementierung des Protokolls.

  - Wurde an Entwurf Server angepasst
  - https://github.com/Level8Broccoli/WebE/blob/main/_dokumentation/architekturdokumentation.md#5-server-client-protokoll

- Das Spiel muss vollständig realisiert sein (ohne vollständiges GUI und Regelüberprüfung).
  - Das Protokoll, GUI und Serverlogik sind für die Spieldurchführung finalisiert.
  - Endpunkte für die Überprüfung der Spielregeln und Gewinner sind noch nicht implementiert. Dies ist für Meilenstein 4 vorgesehen.
- Zweiter Entwurf Server.

  - Es wurde die Gamelogik eingebaut, sodass ein Spiel gespielt werden kann und der Spielstatus vom Server für mehrere parallele Spiele verwaltet wird.
  - Folgende Entpoints und Services wurden neu implementiert und hinzugefügt:
    - `startGame`
    - `drawCard`
    - `discardCard`
    - `skipLevelFulfillStep`
    - `skipPlayCardsStep`
    - `finishFulfillment`
    - `playCard`
    - diverse Hilfsfunktionen

- Zweiter Entwurf GUI.

  - Das GUI wurde von der funktionalen Umgebung nun an den clickable Prototyp angepasst, mit CSS ergänzt und graphisch aufgewertet.
  - Dies beinhaltet folgende Punkte:
    - Loginmaske
    - Spielübersicht
    - Maske für die Spielerstellung
    - Lobby mit Chatfunktion
    - Regelansicht
    - Spielmaske mit Chatfunktion

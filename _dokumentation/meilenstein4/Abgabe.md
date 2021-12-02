# Meilenstein 4

Guten Tag Herr Zimmermann

Hier finden Sie unsere Abgabe zum Meilenstein 4 (WebE):

- Release: [https://github.com/Level8Broccoli/WebE/releases/tag/Milestone4](https://github.com/Level8Broccoli/WebE/releases/tag/Milestone4)
- Kanban Board: [https://github.com/Level8Broccoli/WebE/projects/1](https://github.com/Level8Broccoli/WebE/projects/1)
- Das Spiel kann bereits unter folgender URL ausprobiert werden: [https://game.lvl8.io/](https://game.lvl8.io/)

## Release notes

Bereiten Sie den 4. Meilenstein gemäss der nachfolgender Beschreibung vor.

- Definitive Version Server
    - Spielregeln finalisiert (Regeln für Level-Aufstieg, Rundenend, Spielgewinn wurden implementiert)
    - Datenbank-Anbindung implementiert
    - Bei Spielsieg wird Sieger in Datenbank persistiert
    - Leaderboard aufgrund Sieger in Datenbank zusammengestellt
    - Übersicht Endpoints:
        - `registerPlayer`
        - `logout`
        - `registerExistingPlayer`
        - `editPlayerName`
        - `createGame`
        - `deleteGame`
        - `joinGame`
        - `leaveGame`
        - `chat`
        - `startGame`
        - `drawCard`
        - `discardCard`
        - `skipLevelFulfillStep`
        - `skipPlayCardsStep`
        - `playCard`
        - `finishFulfillment`
        - `leaderboard` NEU
        - `disconnect`
- Definitive Version GUI
    - Minimale Verbesserung Responsive Design
    - Leaderboard GUI erstellt
    - Spielende GUI erstellt
    - Game GUI massiv verbessert 
- Validity Check (Überprüfung der Spielregeln)
    - Spielregeln waren bereits im Meilenstein 3 fast komplett implementiert
    - Letzte Spielregeln implementiert:
        - Level-Aufstieg
        - Rundenend
        - Spielgewinn

- Diverses:
    - Internationalisierung erweitert
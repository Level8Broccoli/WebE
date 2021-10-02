# Meilenstein 2

Guten Tag Herr Zimmermann

Hier finden Sie unsere Abgabe zum Meilenstein 2 (WebE):

- Release: https://github.com/Level8Broccoli/WebE/releases/tag/Milestone2
- Kanban Board: https://github.com/Level8Broccoli/WebE/projects/1

## Release notes

- Spezifikation des Netzwerkprotokolls - erster Entwurf.
    - Wurde an Entwurf Server angepasst
    - https://github.com/Level8Broccoli/WebE/blob/main/_dokumentation/architekturdokumentation.md#5-server-client-protokoll
- Erster Entwurf Server.
    - Folgende Endpoints und Services wurden implementiert:
        - `registerPlayer`
        - `editPlayerName`
        - `createGame`
        - `deleteGame`
        - `joinGame`
        - `leaveGame`
        - `chat`
- Erster Entwurf GUI.
    - clickable Prototype
        - interaktives PDF: https://github.com/Level8Broccoli/WebE/blob/main/_dokumentation/basic_ui_prototype.pdf
    - GUI in VueJS funktional umgesetzt:
        - `PlayerName` (registrieren, editieren, abmelden)
        - `Chat`
        - `CreateGame`
        - `GameOverview` (Spiel verlassen, Spiel löschen)
        - `GameList` (Spiel beitreten)
        - `StoreOutput`
        - `ErrorOutput`
- Die Anmeldung Client beim Server wurde vollständig realisiert
- Senden einer Nachricht von einem Client zu einem anderen Client wurde vollständig realisiert

## Funktionsdemo

Sie finden die Demo im beiligenden Video.

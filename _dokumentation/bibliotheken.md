[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](umsetzung.md) | [Nächste Seite](systemarchitektur.md)

# Verwendete Bibliotheken und Technologien

Das Projekt wurde grundsätzlich in der Sprache «Typescript» umgesetzt. Typescript erweitert JavaScript um Typsicherheit und einfacheres Objekthandling. Die Sprache wurde im Frontend, wie auch im Backend eingesetzt. Als Frontendframework wurde auf Vue.js und im Backend auf Node.js als Runtime-Environment gesetzt. Front- und Backend können unabhängig von einander deployed werden und sind Docker-fähig.

Docker wurde verwendet um einerseits unsere Entwicklungsumgebung VS Code einzurichten und um später die beiden Artefakte in die Cloud zu deployen.

Während des Entwicklungsprozesses sind einige Bibliotheken zusammengekommen, die für die Umsetzung relevant sind. Diese werden nachfolgend näher beschrieben.

| Bibliothek                                                         | Beschreibung                                                                  |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| [luxon](https://moment.github.io/luxon/#/)                         | Bibliothek, die ein einfaches Datum und Zeitmanagement verspricht             |
| [mongodb](https://www.npmjs.com/package/mongodb)                   | Offizielle MongoDB Treiber für die Datenbankverbindung                        |
| [socket.io](https://socket.io/docs/v4/server-installation/)        | Websocket Server Bibliothek                                                   |
| [socket.io-client](https://socket.io/docs/v4/client-installation/) | Websocket Client Bibliothek                                                   |
| [uuid](https://www.npmjs.com/package/uuid)                         | Bibliothek zum Erstellen von eindeutigen Id's                                 |
| [vue](https://vuejs.org/)                                          | Frontend-Framework                                                            |
| [vuex](https://vuex.vuejs.org/)                                    | Erweiterung Frontend-Framework für Datenhaltung und Statemanagement im Client |

[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](umsetzung.md) | [Nächste Seite](systemarchitektur.md)

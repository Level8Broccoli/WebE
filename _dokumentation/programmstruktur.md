[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](systemarchitektur.md) | [Nächste Seite](beispielsession.md)

# Programmstruktur

## \_dokumentation

Das Verzeichnis beinhaltet sämtliche für die Dokumentation relevanten Dokumente in Form von Markdown Files u.a. :

- Projektdokumentation
- Milestones
- Projekttagebuch

## \_vorgaben

Hier befinden sich alle Dokumente, die die Anforderungen an das Projekt seitens FFHS beinhalten.

## .devcontainer & .vscode

Diese beiden Verzeichnisse beinhaltet Daten für die Konfiguration der Entwicklungsumgebung mit Docker.

## src

Das Verzeichnis ist der Kern des Projektes und enthält sämtlichen Quellcode und Konfigurationsdateien für das Projekt. Dabei werden folgende Subverzeichnisse unterschieden:

| Verzeichnis | Beschreibung                                                                                 |
| ----------- | -------------------------------------------------------------------------------------------- |
| frontend    | Programmcode des Frontends                                                                   |
| backend     | Programmcode des Backends                                                                    |
| public      | Öffentliche Daten für Frontend (PDF's mit Spielregeln)                                       |
| shared      | Geteilte Resourcen (hauptsächlich Datenklassen), die in Front- und Backend verwendet werden. |

[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](systemarchitektur.md) | [Nächste Seite](beispielsession.md)

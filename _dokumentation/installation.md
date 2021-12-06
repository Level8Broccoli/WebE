[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](ausblick_grenzen.md)

# Installation

## Voraussetzung

Um das Level 8 Game in Betrieb zu nehmen, müssen folgende Voraussetzungen erfüllt sein:

- [Node.js, Version 16+](https://nodejs.org/en/)
- [Yarn, Version 1+](https://yarnpkg.com/)

## Dependencies installieren

Im Verzeichnis `/src` können alle Dependencies mit `yarn install` installiert werden.

## Projekte builden

Das Frontend wird mit dem Befehl `yarn build-frontend` erstellt. Das Backend mit dem Befehl `yarn build-backend`.

Die jeweiligen Projekte werden in die Ordner `/src/dist-frontend` respektive `/src/dist-backend` ausgegeben.

## Projekte starten

Das Frontend (`/src/dist-frontend`) besteht aus statischen Files und kann über einen Webserver gehostet werden (z.B. [Netlify](https://www.netlify.com/)).

Das Backend (`/src/dist-backend`) kann auf einen Server, auf dem [Node.js](https://nodejs.org/en/) ausführbar ist, mit `node /src/dist-backend/server.js` gestartet werden (z.B. [Heroku](https://heroku.com/)).

[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](ausblick_grenzen.md)
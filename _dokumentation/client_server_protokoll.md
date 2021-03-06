[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](anforderungen.md) | [Nächste Seite](umsetzung.md)

# Server-Client Protokoll

Im folgenden werden die Nachrichten aufgeführt, die zwischen Clients und Server ausgetauscht werden können. Um eine Realtime-Anwendung zu bauen, wurde entschieden, über das Websocket Protokoll JSON-Nachrichten auszutauschen. Eine Nachricht besteht dabei immer aus einem Sender, einem Empfänger und einem Eventtyp.

Grundsätzlich werden folgende Datenpunkte regelmässig verwendet:

| Datenpunkt       | Beschreibung                                                                        |
| ---------------- | ----------------------------------------------------------------------------------- |
| `event`          | Klassifizierung der Nachricht                                                       |
| `game`           | Beinhaltet eine Spielreferenz                                                       |
| `game.id`        | UUID des Spielraums                                                                 |
| `game.creatorId` | UUID des Spielraumerstellers                                                        |
| `game.players`   | Liste der Spieler Id's in der Lobby                                                 |
| `game.config`    | Spielkonfiguration                                                                  |
| `game.status`    | Aktueller Spielstatus (Lobby, Gestartet, Beendet)                                   |
| `game.chat`      | Liste der Chatnachrichten in der Lobby                                              |
| `game.cards`     | Alle Karten des Spiels                                                              |
| `game.levels`    | Der Reihenfolgen der Levels                                                         |
| `game.state`     | Beinhaltet den Spielstand (siehe unten)                                             |
| `timestamp`      | Server-Zeitstempel                                                                  |
| `player`         | Beinhaltet eine Spielerreferenz                                                     |
| `player.Id`      | UUID um Spieler zu identifizieren (wird auch an andere Spieler weitergegeben)       |
| `player.secret`  | UUID um Spieler zu authentifizieren (wird nur zwischen Client und Server verwendet) |
| `player.name`    | Wird vom GUI verwendet (z.B. Autor einer Chatnachricht, aktiver Spieler)            |

## Spielstand

Der Spielstand beinhaltet:

- `playerId` des aktiven Spielers
- Karten auf dem Spieltisch
- Karten auf der Hand des Spielers, der die Nachricht erhält
- Anzahl Karten aller Spieler auf deren Händen
- Anzahl Karten auf dem Ziehstapel
- Liste von erlaubten Spielzügen, falls der aktive Spieler die Anfrage gesendet hat
- Protokoll aller vergangenen Spielzügen

# Nachrichtenformate

Die einzelnen Nachrichten für die Kommunikation zwischen Client und Server werden folgend näher beschrieben:

## Registrierung eines neuen Spielers am Server

### Request

| Sender    | Empfänger | Event            |
| --------- | --------- | ---------------- |
| Client[1] | Server    | `registerPlayer` |

```json
{
  "playerName": "[playerName]"
}
```

### Response

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[1] | `registerPlayer` |

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "games": [
    // Liste aller aktiven Spielräume, deren Konfiguration und Anzahl besetzter Plätze
  ]
}
```

## Logout eines Spielers vom Server

### Request

| Sender    | Empfänger | Event    |
| --------- | --------- | -------- |
| Client[1] | Server    | `logout` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  }
}
```

### Responses

| Sender | Empfänger | Event    |
| ------ | --------- | -------- |
| Server | Client[1] | `logout` |

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "playerId": "[playerId]"
}
```

| Sender | Empfänger | Event              |
| ------ | --------- | ------------------ |
| Server | Client[n] | `updatePlayerList` |

```json
{
  "playerList": [
    // Liste aller am Server angemeldeter Spieler
  ]
}
```

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Liste aller offener Spiele auf dem Server
  ]
}
```

## Neuverbindung auf den Server (Clientrefresh oder nach Verbindungsverlust)

### Request

| Sender    | Empfänger | Event                    |
| --------- | --------- | ------------------------ |
| Client[1] | Server    | `registerExistingPlayer` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  }
}
```

### Responses

| Sender | Empfänger | Event                    |
| ------ | --------- | ------------------------ |
| Server | Client[1] | `registerExistingPlayer` |

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "games": [
    // Liste aller Spiele auf dem Server
  ],
  "activeGameId": "[activeGameId]"
}
```

| Sender | Empfänger | Event              |
| ------ | --------- | ------------------ |
| Server | Client[n] | `updatePlayerList` |

```json
{
  "playerList": [
    // Liste aller am Server angemeldeter Spieler
  ]
}
```

## Spielername aktualisieren

### Request

| Sender    | Empfänger | Event            |
| --------- | --------- | ---------------- |
| Client[1] | Server    | `editPlayerName` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  }
}
```

### Responses

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `editPlayerName` |

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  }
}
```

| Sender | Empfänger | Event              |
| ------ | --------- | ------------------ |
| Server | Client[n] | `updatePlayerList` |

```json
{
  "playerList": [
    // Liste aller am Server angemeldeter Spieler
  ]
}
```

## Spiel erstellen

### Request

| Sender     | Empfänger | Event        |
| ---------- | --------- | ------------ |
| Client [1] | Server    | `createGame` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "config": {
    // Spielkonfiguration
  }
}
```

### Responses

| Sender | Empfänger  | Event        |
| ------ | ---------- | ------------ |
| Server | Client [n] | `createGame` |

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "player": {
    "id": "[playerId]",
    "name": "[playerName]"
  },
  "game": {
    "id": "[gameId]",
    "creatorId": "[creatorId]",
    "players": [
      // Liste von Spieler Id's in der Lobby
    ],
    "config": {
      // Spielkonfiguration
    },
    "chat": [
      // Liste von Chat Meldungen in der Lobby
    ]
  }
}
```

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Liste aller offener Spiele auf dem Server
  ]
}
```

## Spiel löschen

### Request

| Sender     | Empfänger | Event        |
| ---------- | --------- | ------------ |
| Client [1] | Server    | `deleteGame` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]"
}
```

### Responses

| Sender | Empfänger  | Event        |
| ------ | ---------- | ------------ |
| Server | Client [n] | `deleteGame` |

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "gameId": "[deletedGameId]"
}
```

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Liste aller offener Spiele auf dem Server
  ]
}
```

## Spiel beitreten

### Request

| Sender     | Empfänger | Event      |
| ---------- | --------- | ---------- |
| Client [1] | Server    | `joinGame` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]"
}
```

### Responses

| Sender | Empfänger  | Event      |
| ------ | ---------- | ---------- |
| Server | Client [n] | `joinGame` |

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "player": {
    "id": "[playerId]",
    "name": "[playerName]"
  },
  "game": {
    // Spielinformationen
  }
}
```

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Liste aller offener Spiele auf dem Server
  ]
}
```

## Spiel verlassen

### Request

| Sender     | Empfänger | Event       |
| ---------- | --------- | ----------- |
| Client [1] | Server    | `leaveGame` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]"
}
```

### Responses

| Sender | Empfänger  | Event       |
| ------ | ---------- | ----------- |
| Server | Client [n] | `leaveGame` |

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "player": {
    "id": "[playerId]",
    "name": "[playerName]"
  },
  "gameId": "[gameId]"
}
```

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Liste aller offener Spiele auf dem Server
  ]
}
```

## Mit Spielern chatten

## Request

| Sender     | Empfänger | Event  |
| ---------- | --------- | ------ |
| Client [1] | Server    | `chat` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]",
  "message": "[chatMessage]"
}
```

## Response

| Sender | Empfänger  | Event  |
| ------ | ---------- | ------ |
| Server | Client [n] | `chat` |

```json
{
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "playerId": "[playerId]",
  "message": "[chatMessage]"
}
```

## Spiel starten

### Request

| Sender     | Empfänger | Event       |
| ---------- | --------- | ----------- |
| Client [1] | Server    | `startGame` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]"
}
```

### Response

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Rückgabe der Spielzustände pro Spieler
  ]
}
```

## Karte ziehen

### Request

| Sender     | Empfänger | Event      |
| ---------- | --------- | ---------- |
| Client [1] | Server    | `drawCard` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]",
  "pileId": "[pileId]"
}
```

### Response

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Rückgabe der Spielzustände pro Spieler
  ]
}
```

## Karte ablegen

### Request

| Sender     | Empfänger | Event         |
| ---------- | --------- | ------------- |
| Client [1] | Server    | `discardCard` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]",
  "cardId": "[pileId]"
}
```

### Response

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Rückgabe der Spielzustände pro Spieler
  ]
}
```

## Level auslegen überspringen

### Request

| Sender     | Empfänger | Event                  |
| ---------- | --------- | ---------------------- |
| Client [1] | Server    | `skipLevelFulfillStep` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]"
}
```

### Response

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Rückgabe der Spielzustände pro Spieler
  ]
}
```

## Karte auslegen überspringen

### Request

| Sender     | Empfänger | Event               |
| ---------- | --------- | ------------------- |
| Client [1] | Server    | `skipPlayCardsStep` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]"
}
```

### Response

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Rückgabe der Spielzustände pro Spieler
  ]
}
```

## Karte auspielen

### Request

| Sender     | Empfänger | Event      |
| ---------- | --------- | ---------- |
| Client [1] | Server    | `playCard` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]",
  "cardId": "[cardId]",
  "cardRowId": "[cardRowId]"
}
```

### Response

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Rückgabe der Spielzustände pro Spieler
  ]
}
```

## Level auslegen

### Request

| Sender     | Empfänger | Event               |
| ---------- | --------- | ------------------- |
| Client [1] | Server    | `finishFulfillment` |

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "gameId": "[gameId]",
  "level": [
    // Zu prüfende Karten für das aktuelle Level (CardRowRequest)
  ]
}
```

### Response

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    // Rückgabe der Spielzustände pro Spieler
  ]
}
```

## Leaderboard abfragen

### Request

| Sender     | Empfänger | Event         |
| ---------- | --------- | ------------- |
| Client [1] | Server    | `leaderboard` |

```json
{
  // leer
}
```

### Response

| Sender | Empfänger | Event         |
| ------ | --------- | ------------- |
| Server | Client[1] | `leaderboard` |

```json
{
  "leaderboard": [
    // Sortierte Leaderboardeinträge der Form {"name":"[name]", "wins": number}
  ]
}
```

[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](anforderungen.md) | [Nächste Seite](umsetzung.md)

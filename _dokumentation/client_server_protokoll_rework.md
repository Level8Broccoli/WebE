[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](anforderungen.md) | [Nächste Seite](umsetzung.md)

# Server-Client Protokoll

Im folgenden werden die Nachrichten aufgeführt, die zwischen Clients und Server ausgetauscht werden können. Um eine Realtime-Anwendung zu bauen, wurde entschieden, über das Websocket Protokoll JSON-Nachrichten auszutauschen. Eine Nachricht besteht dabei immer aus einem Sender, einem Empfänger und einem Eventtyp.

Grundsätzlich werden folgende Datenpunkte regelmässig verwendet:

Die einzelnen Nachrichten werden folgend näher beschrieben:

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
    /* Liste aller aktiven Spielräume, deren Konfiguration und Anzahl besetzter Plätze */
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
    /* Liste aller am Server angemeldeter Spieler */
  ]
}
```

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    /* Liste aller offener Spiele auf dem Server */
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
    /* Liste aller Spiele auf dem Server */
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
    /* Liste aller am Server angemeldeter Spieler */
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
    /* Liste aller am Server angemeldeter Spieler */
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
    /* Spielkonfiguration */
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
      /* Liste von Spieler Id's in der Lobby */
    ],
    "config": {
      /* Spielkonfiguration */
    },
    "chat": [
      /* Liste von Chat Meldungen in der Lobby */
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
    /* Liste aller offener Spiele auf dem Server */
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
    /* Liste aller offener Spiele auf dem Server */
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
    /* Spielinformationen */
  }
}
```

| Sender | Empfänger | Event            |
| ------ | --------- | ---------------- |
| Server | Client[n] | `updateGameList` |

```json
{
  "gameList": [
    /* Liste aller offener Spiele auf dem Server */
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
    /* Liste aller offener Spiele auf dem Server */
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
    /* Rückgabe der Spielzustände pro Spieler */
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
    /* Rückgabe der Spielzustände pro Spieler */
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
    /* Rückgabe der Spielzustände pro Spieler */
  ]
}
```

[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](anforderungen.md) | [Nächste Seite](umsetzung.md)

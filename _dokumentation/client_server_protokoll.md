[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](anforderungen.md)

# Server-Client Protokoll

Im folgenden werden die Nachrichten aufgeführt, die zwischen Clients und Server ausgetauscht werden können.

Grundsätzlich werden folgende Datenpunkte regelmässig verwendet:

| Datenpunkt       | Beschreibung                                                                        |
| ---------------- | ----------------------------------------------------------------------------------- |
| `event`          | Klassifizierung der Nachricht                                                       |
| `game`           | Beinhaltet eine Spielreferenz                                                       |
| `game.id`        | UUID des Spielraums                                                                 |
| `game.creatorId` | UUID des Spielraumerstellers                                                        |
| `game.players`   | Liste der Spieler Id's in der Lobby                                                 |
| `game.config`    | Spielkonfiguration                                                                  |
| `game.chat`      | Liste der Chatnachrichten in der Lobby                                              |
| `timestamp`      | Server-Zeitstempel                                                                  |
| `player`         | Beinhaltet eine Spielerreferenz                                                     |
| `player.Id`      | UUID um Spieler zu identifizieren (wird auch an andere Spieler weitergegeben)       |
| `player.secret`  | UUID um Spieler zu authentifizieren (wird nur zwischen Client und Server verwendet) |
| `player.name`    | Wird vom GUI verwendet (z.B. Autor einer Chatnachricht, aktiver Spieler)            |
| `gameState`      | Beinhaltet den Spielstand (siehe unten)                                             |

## Spielstand

Der Spielstand beinhaltet:

- `playerId` des aktiven Spielers
- Karten auf dem Spieltisch
- Karten auf der Hand des Spielers, der die Nachricht erhält
- Anzahl Karten aller Spieler auf deren Händen
- Anzahl Karten auf dem Ziehstapel
- Liste von erlaubten Spielzügen, falls der aktive Spieler die Anfrage gesendet hat
- Protokoll aller vergangenen Spielzügen

## Spieler registration

Jeder Spieler muss sich mit einem Benutzernamen registrieren.

### Spieler sendet Benutzername an Server

| Sender     | Empfänger | Event            |
| ---------- | --------- | ---------------- |
| Client [1] | Server    | `registerPlayer` |

### Body

```json
{
  "playerName": "[playerName]"
}
```

### Server teilt Spieler ID und verfügbare Räume mit

| Sender | Empfänger  | Event            |
| ------ | ---------- | ---------------- |
| Server | Client [1] | `registerPlayer` |

### Body

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

## Spiel erstellen

Jeder Spieler kann ein Spiel bzw. Spielraum erstellen.

### Spieler sendet Server Bitte um Kreation eines Spielraums

| Sender     | Empfänger | Event        |
| ---------- | --------- | ------------ |
| Client [1] | Server    | `createGame` |

### Body

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

### Server broadcastet allen Spielern, die keinem Spiel zugewiesen sind, den neuerstellten Spielraum

| Sender | Empfänger  | Event        |
| ------ | ---------- | ------------ |
| Server | Client [n] | `createGame` |

### Body

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

## Spiel abbrechen

Der Ersteller eines Spiels kann diesen löschen, solange das Spiel noch nicht gestartet wurde

### 5.4.1 Spieler sendet Server Bitte um Löschung eines Spielraums

| Sender     | Empfänger | Event        |
| ---------- | --------- | ------------ |
| Client [1] | Server    | `deleteGame` |

### Body

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "game": {
    "id": "[gameId]"
  }
}
```

### Server broadcastet allen Spielern, die keinem Spiel zugewiesen sind und allen Spielern, die bereits beigetreten sind, dass dieses Spiel gelöscht wurde

| Sender | Empfänger  | Event        |
| ------ | ---------- | ------------ |
| Server | Client [n] | `deleteGame` |

### Body

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "game": {
    "id": "[deletedGameId]"
  }
}
```

## Spiel beitreten

Jeder Spieler kann einem Spiel beitreten, welches noch nicht gestartet wurde und noch Plätze verfügbar hat.

### Spieler sendet Server die gewünschte Spiel ID

| Sender     | Empfänger | Event      |
| ---------- | --------- | ---------- |
| Client [1] | Server    | `joinGame` |

### Body

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "game": {
    "id": "[gameId]"
  }
}
```

### Server broadcastet allen Spieler, dass ein Spieler einem Spiel beigetreten ist

| Sender | Empfänger  | Event      |
| ------ | ---------- | ---------- |
| Server | Client [n] | `joinGame` |

### Body

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "player": {
    "id": "[playerId]",
    "name": "[playerName]"
  },
  "game": {
    "id": "[gameId]"
  }
}
```

## Spiel verlassen

Jeder Spieler kann eine Lobby verlassen, nachdem er sie betreten hat.

### Spieler sendet Server die gewünschte Spiel ID

| Sender     | Empfänger | Event       |
| ---------- | --------- | ----------- |
| Client [1] | Server    | `leaveGame` |

### Body

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "game": {
    "id": "[gameId]"
  }
}
```

### Server broadcastet allen Spieler, dass ein Spieler ein Spiel verlassen hat.

| Sender | Empfänger  | Event       |
| ------ | ---------- | ----------- |
| Server | Client [n] | `leaveGame` |

### Body

```json
{
  "status": "[StatusCode]",
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "player": {
    "id": "[playerId]",
    "name": "[playerName]"
  },
  "game": {
    "id": "[gameId]"
  }
}
```

## Chat-Nachrichten

Sendet Nachrichten an den Server, welcher wiederum die Nachrichten den anderen Spielern im selben Spiel weiterleitet.

### Spieler sendet Chat-Nachricht an Server

| Sender     | Empfänger | Event  |
| ---------- | --------- | ------ |
| Client [1] | Server    | `chat` |

### Body

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "game": {
    "id": "[gameId]"
  },
  "message": "[chatMessage]"
}
```

### Server broadcastet Chat-Nachricht an alle Spieler in Spielraum

| Sender | Empfänger  | Event  |
| ------ | ---------- | ------ |
| Server | Client [n] | `chat` |

### Body

```json
{
  "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
  "player": {
    "id": "[playerId]",
    "name": "[playerName]"
  },
  "message": "[chatMessage]"
}
```

## Spiel starten

Der Ersteller des Spiels kann das Spiel starten, sobald die minimale Spieleranzahl erreicht wurde.

### Spieler sendet Server Bitte um Start des Spiels

| Sender     | Empfänger | Event       |
| ---------- | --------- | ----------- |
| Client [1] | Server    | `startGame` |

### Body

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "game": {
    "id": "[gameId]"
  }
}
```

### Server broadcastet initialen Spielstand und die jeweilig private Hand an alle Spieler im Spiel

| Sender | Empfänger  | Event       |
| ------ | ---------- | ----------- |
| Server | Client [n] | `startGame` |

### Body

```json
{
  "gameList": [
    /* Informationen zum Spiel (Spielstand, Hand des Spielers etc. */
  ]
}
```

# TBD ACHTUNG Fehlt irgendwie

## Spielstand

Gibt dem Client die Möglichkeit den aktuellen Spielstand abzufragen, um das korrekte GUI anzuzeigen. Wird u.a. verwendet, wenn ein Spieler den Browser neulädt.

### Spieler sendet Server Bitte um aktuellen Spielstand

| Sender     | Empfänger | Event       |
| ---------- | --------- | ----------- |
| Client [1] | Server    | `gameState` |

### Body

```json
{
  "event": "gameState",
  "data": {
    "playerName": "[playerName]",
    "playerId": "[playerId]",
    "secret": "[secret]",
    "gameId": "[gameId]"
  }
}
```

### Server sendet aktuellen Spielstand an Spieler

| Sender | Empfänger  | Event       |
| ------ | ---------- | ----------- |
| Server | Client [1] | `gameState` |

### Body

```json
{
  "event": "gameState",
  "data": {
    "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
    "gameState": {
      /* aktueller Spielstand */
    }
  }
}
```

# Ende TBD Achtung

## Spielzug

Der aktive Spieler kann einen Spielzug durchführen. Falls dieser valide ist, erhalten alle Spieler im Spiel einen aktualisierten Spielstand.

### Spieler nimmt eine Karte auf.

| Sender     | Empfänger | Event      |
| ---------- | --------- | ---------- |
| Client [1] | Server    | `drawCard` |

### Body

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "game": {
    "id": "[gameId]"
  },
  "pileId": "[pileId]"
}
```

### Spieler erhält seine aktualisierte Hand mit der neuen Karte.

| Sender | Empfänger  | Event      |
| ------ | ---------- | ---------- |
| Server | Client [1] | `drawCard` |

### Body

```json
{
  "gameList": [
    /* Informationen zum Spiel (Spielstand, Hand des Spielers etc. */
  ]
}
```

### Spieler sendet einen Spielzug

| Sender     | Empfänger | Event      |
| ---------- | --------- | ---------- |
| Client [1] | Server    | `gameMove` |

### Body

```json
{
  "event": "gameMove",
  "data": {
    "playerName": "[playerName]",
    "playerId": "[playerId]",
    "secret": "[secret]",
    "gameId": "[gameId]",
    "move": "[move]"
  }
}
```

### Server broadcastet aktuellen Spielstand an alle Spieler im Spiel

| Sender | Empfänger  | Event      |
| ------ | ---------- | ---------- |
| Server | Client [n] | `gameMove` |

### Body

```json
{
  "event": "gameMove",
  "data": {
    "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
    "gameState": {
      /* aktueller Spielstand */
    }
  }
}
```

### Spieler legt Karte ab.

| Sender     | Empfänger | Event         |
| ---------- | --------- | ------------- |
| Client [1] | Server    | `discardCard` |

### Body

```json
{
  "player": {
    "id": "[playerId]",
    "name": "[playerName]",
    "secret": "[secret]"
  },
  "game": {
    "id": "[gameId]"
  },
  "card": {
    "id": "[cardId]"
  }
}
```

## Spiel abbrechen

Jeder Spieler kann die restlichen Spieler um ein Spielabbruch bitten. Sollte innert festgelegter Frist kein anderer Spieler dem Abbruch widersprechen, wird das Spiel abgebrochen.

### Spieler sendet Anfrage um Spielabbruch bzw. Mitspieler bestätigen Abbruch oder widersprechen Abbruch

| Sender     | Empfänger | Event       |
| ---------- | --------- | ----------- |
| Client [1] | Server    | `gameAbort` |

### Body

```json
{
   "event": "gameAbort",
   "data": {
      "playerName": "[playerName]",
      "playerId": "[playerId]",
      "secret": "[secret]",
      "gameId": "[gameId]",
      "wantsToAbort": [true|false]
   }
}
```

### Server broadcastet Anfrage an alle Spieler im Spiel

| Sender | Empfänger  | Event       |
| ------ | ---------- | ----------- |
| Server | Client [n] | `gameAbort` |

### Body

```json
{
   "event": "gameAbort",
   "data": {
      "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
      "playerName": "[playerName]",
      "playerId": "[playerId]",
      "wantsToAbort": [true|false]
   }
}
```

## Spielraumübersicht

Gibt dem Client die Möglichkeit den offnen Spielräume abzufragen, um das korrekte GUI anzuzeigen. Wird u.a. verwendet, wenn ein Spieler den Browser neulädt oder ein Spiel verlässt.

### Spieler sendet Server Bitte um aktuelle Spielraumübersicht

| Sender     | Empfänger | Event       |
| ---------- | --------- | ----------- |
| Client [1] | Server    | `gameState` |

### Body

```json
{
  "event": "gameState",
  "data": {
    "playerName": "[playerName]",
    "playerId": "[playerId]",
    "secret": "[secret]"
  }
}
```

### Server sendet aktuelle Spielraumübersicht an Spieler

| Sender | Empfänger  | Event       |
| ------ | ---------- | ----------- |
| Server | Client [1] | `gameState` |

### Body

```json
{
  "event": "gameState",
  "data": {
    "timestamp": "[timestamp | YYYY-MM-DDThh:mm:ss]",
    "games": [
      /* Liste aller aktiven Spielräume, deren Konfiguration und Anzahl besetzter Plätze */
    ]
  }
}
```

[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](anforderungen.md)

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

## Response

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

[Inhaltsverzeichnis](inhaltsverzeichnis.md) | [Vorherige Seite](anforderungen.md) | [Nächste Seite](umsetzung.md)

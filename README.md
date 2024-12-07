# KalenderApp

Eine Anwendung zur Anzeige und Verwaltung von Seminaren, basierend auf einer Node.js REST-API, einer MariaDB-Datenbank und einem React-Frontend.

## Voraussetzungen

Stelle sicher, dass die folgende Software installiert ist::

- [Node.js](https://nodejs.org/) (version 14 oder höher)
- [MariaDB](https://mariadb.org/)
- [npm](https://www.npmjs.com/) (npm ist ein Paketmanager für die JavaScript-Laufzeitumgebung Node.js)

---

## Installation

### 1. Repository klonen

```bash
git clone <repository-url>
```

## Aufsetzen der MariaDB Datenbank

Folge diesen Schritten, um die Datenbank zu erstellen:

1. Passe die Passwörter in den .env-Dateien an das root-Passwort der lokalen Datenbank an.
2. Lade die SQL-Dump-Datei herunter.
3. Starte die HeidiSQL (oder einen anderen Verbindungsmanager).
4. Stelle eine Verbindung mit MariaDB.
5. Klicke auf Datei -> SQL-Datei laden -> wähle den SQL-Dump aus.
6. Führe den SQL-Dump aus.

### Alle Module installieren

1. Öffne ein Terminal im Projektordner.
2. Führe aus:

```bash
npm run install-all
```

### App starten

1. Öffne ein Terminal im Projektordner.
2. Führe aus:

```bash
npm start
```

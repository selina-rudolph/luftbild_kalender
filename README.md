# Wo ist das? - Sofies Adventskalender

## Lokal in VS Code starten

1. ZIP-Datei entpacken.
2. Den Ordner `sofies_adventskalender` in VS Code öffnen.
3. Node.js installieren, falls noch nicht installiert: https://nodejs.org/
4. In VS Code **Terminal → Neues Terminal** auswählen.
5. Im Terminal folgende Befehle eingeben:

```bash
npm install
npm start
```

6. Vite zeigt im Terminal eine lokale Adresse an (normalerweise http://localhost:5173). Öffne diese Adresse im Browser.
7. Zum Beenden im Terminal `Strg+C` drücken.

## Bilder

- Hintergrund: `bilder/hintergrund.jpg`
- Lege deine Rätselbilder in den Ordner `bilder/`. Dateinamen und Endungen sind frei wählbar.
- Trage den vollständigen relativen Bildpfad für jedes Türchen in `script.js` ein.

## Antworten eintragen

Öffne `script.js` und bearbeite die Einträge im `riddles`-Array. `image` ist der Pfad zum Bild; in `answers` stehen eine oder mehrere gültige Antworten. Jede Antwort wird unabhängig geprüft und löst das Türchen. Beispiel:

```js
{
  day: 1,
  image: "bilder/Bled.jpg",
  answers: ["Bled", "Bleder See"],
  solution: "Bled"
}
```

`solution` ist optional und wird als zusätzliche Anzeige nach dem Lösen verwendet. Wenn noch kein Bild oder keine Antwort eingetragen ist, kannst du die entsprechenden Felder leer lassen; ein Türchen ohne eingetragene Antworten kann noch nicht gelöst werden.

## Freischaltung

Die Türchen sind im Dezember jeweils ab ihrem Kalendertag freigeschaltet. Zum Testen kannst du in `script.js` `TEST_MODE` auf `true` setzen; dadurch sind alle Türchen sofort geöffnet. Vor der Veröffentlichung `TEST_MODE` wieder auf `false` setzen.

## Veröffentlichung

Das Projekt ist als einfache statische Website gedacht und kann später auf GitHub Pages
veröffentlicht werden. Für GitHub Pages wird keine laufende npm-Instanz benötigt.

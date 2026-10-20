# Ausgaben Tracker PWA 📱💳

Eine einfache, schnelle und moderne Progressive Web App (PWA) zum Tracken deiner täglichen Ausgaben mit Bezahlarten, Kategorien und Geschäften/Verkäufern.

---

## 🎨 Zwei parallele Designs (Exact gleiche Funktionen & Daten)

Die App bietet zwei Design-Varianten mit identischer Tastenanordnung, gleichen Funktionen und geteilter Datenspeicherung:

1. **Design 1 (Dark Slate Studio):**
   - Dunkles, elegantes Slate-Design mit Glassmorphism-Akzenten.
   - Standardmäßig unter: `index.html` (bzw. Haupt-URL)

2. **Design 2 (Clean Studio Light – Dribbble/Linear Style):**
   - Helles, ultra-sauberes Studio-Design orientiert an modernen Vorlagen (weicher Hintergrund, reinweiße Karten, schwarze Pill-Buttons, dezente Schatten, Pastell-Badges).
   - Erreichbar über:
     - Die parallele Seite: **`light.html`**
     - Den Umschalt-Button oben rechts in der Navigationsleiste (`✨ Design 2` / `🌙 Design 1`)
     - Den Bereich **Optionen → Design & Erscheinungsbild**
     - Oder URL-Parameter: `?design=2` bzw. `?design=light`

---

## 🌐 Auf GitHub Pages veröffentlichen

Die App ist so eingerichtet, dass sie automatisch über GitHub Pages gebaut und veröffentlicht wird, sobald du den Code auf GitHub pushst.

### Schritt 1: Code zu GitHub pushen
```bash
git add .
git commit -m "feat: Ausgaben Tracker mit Design 1 & 2 und Verkäufern"
git branch -M main
git remote add origin https://github.com/<DEIN-GITHUB-BENUTZERNAME>/<DEIN-REPO-NAME>.git
git push -u origin main
```

### Schritt 2: GitHub Pages in den Repository-Einstellungen aktivieren
1. Gehe auf GitHub in dein Repository (`https://github.com/L3nn0/ausgaben-tracker`).
2. Klicke oben auf **Settings** (Einstellungen) ⚙️ → links auf **Pages**.
3. **Möglichkeit A (über /docs):**
   - Source: `Deploy from a branch`
   - Branch: `main` und Ordner: 👉 **`/docs`** auswählen
4. **Möglichkeit B (über GitHub Actions):**
   - Source: 👉 **`GitHub Actions`** auswählen

---

## ✨ Features der App

1. **Artikel / Ausgaben erfassen:**
   - Titel/Artikel, Preis (€), Geschäft/Verkäufer, Bezahlart, Kategorie, Datum und Notiz.
   - **Inline-Erstellung:** Direkt beim Erfassen einer Ausgabe kannst du mit einem Klick neue Kategorien oder Geschäfte erstellen, die sofort gespeichert werden.

2. **Bezahlarten-Übersicht & Summen:**
   - Zeigt alle Bezahlarten (z.B. Bar, Kreditkarte, Girocard, PayPal) mit Summen und Anteilen.
   - **Klick auf eine Bezahlart:** Zeigt alle zugehörigen Artikel an.

3. **Geschäfte & Verkäufer:**
   - Eigenständige Entität, durchsuchbar im Suchfeld, mit eigenem Filter im Tab *Ausgaben* und Badge in der Listenansicht.

4. **Löschfunktionen:**
   - Einzelne Artikel löschen.
   - **Alle Artikel gleichzeitig löschen** (mit Sicherheitsabfrage).
   - Alle Artikel einer bestimmten Bezahlart löschen.

5. **PWA, Persistenz & Download:**
   - **Dauerhafte Speicherung:** Daten bleiben bei jedem Neustart erhalten.
   - **100% Offline-fähig:** Funktioniert dank Service Worker auch ohne Internet.
   - **JSON- & CSV-Download:** Ausgaben als Backup oder für Microsoft Excel exportieren.
